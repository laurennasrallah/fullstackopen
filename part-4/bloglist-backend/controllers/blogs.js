const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body)
    console.log(request.body)

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    console.log('ERROR', error.message)
    response.status(400).json({ error: 'invalid blog' })
  }
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
