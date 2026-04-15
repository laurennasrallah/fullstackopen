const Blog = require('../models/blog')
const User = require('../models/user')

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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

const loginAsRoot = async (api) => {
  const login = {
    username: 'root',
    password: 'sekret',
  }

  const response = await api.post('/api/login').send(login)
  return response.body.token
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  loginAsRoot,
}
