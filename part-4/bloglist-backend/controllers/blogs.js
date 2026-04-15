const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  console.log('POST route started')
  try {
    const user = request.user
    console.log('USER IN ROUTE', user)
    const blog = new Blog({
      ...request.body,
      user: user._id,
    })
    console.log(request.body)

    const savedBlog = await blog.save()
    console.log('BLOG SAVED', savedBlog)
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    console.log('ERROR', error.message)
    response.status(400).json({ error: 'invalid blog' })
  }
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog is missing' })
  }

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    return response.status(403).json({ error: 'user not authorized' })
  }
})

blogRouter.put('/:id', async (request, response) => {
  /*
findByIdAndUpdate Parameters:

1. id:
   The unique _id of the document we want to update.

2. update:
   An object containing the fields to update and their new values.

3. options:
   new: if true, returns the updated document (default: false)
   upsert: if true, creates the document if it doesn’t exist
   runValidators: if true, runs schema validation during update

4. callback:
   Optional. Instead of callback, we can use async/await or .then().

Return Value:

Returns the updated document if new: true is specified, 
or the original document if new: false (default).
If no document is found with the specified id, it returns null.
  
*/

  const updatedData = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedData,
    { new: true },
  )
  response.json(updatedBlog)
})

module.exports = blogRouter

// no need for a try/catch block as Express 5 automatically passes rejcted promises

// blogRouter.get('/', async (request, response) => {
//   try {
//     const blogs = await Blog.find({})
//     response.json(blogs)
//   } catch (error) {
//     console.log('ERROR', error.message)
//     response.status(500).json({error: 'database error'})
//   }
// })

// blogRouter.post('/', async (request, response) => {
//   try {
//     const blog = new Blog(request.body)
//     await blog.save()
//     response.status(201).json(blog)
//   } catch (error) {
//     console.log('ERROR', error.message)
//     response.status(400).json({ error: 'invalid blog' })
//   }
// })
