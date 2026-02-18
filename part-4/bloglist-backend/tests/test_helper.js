const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Tester',
    url: 'http://test.com',
    likes: 5,
  },
  {
    title: 'Second blog',
    author: 'Someone',
    url: 'http://example.com',
    likes: 3,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
}
