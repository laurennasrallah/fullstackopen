const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

let testUser
let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  testUser = new User({ username: 'root', passwordHash })
  await testUser.save()

  const loginResponse = await api.post('/api/login').send({
    username: 'root',
    password: 'sekret',
  })

  token = loginResponse.body.token

  const blogWithUser = new Blog({
    title: 'First blog',
    author: 'Tester',
    url: 'http://test.com',
    likes: 5,
    user: testUser._id,
  })

  await blogWithUser.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  //   await api.get('/test').expect(200)
})

test('blogs have a unique identifier property', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]
  assert(firstBlog.id !== undefined)
  assert(firstBlog._id === undefined)
  //console.log(firstBlog)
})

test('a valid blog can be added ', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const newBlog = {
    title: 'Test blog',
    author: 'Tester',
    url: 'http://test.com',
    likes: 8,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

  const contents = blogsAtEnd.map((blog) => blog.title)
  assert(contents.includes(newBlog.title))
})

test('a blog with missing likes still gets added', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const newBlog = {
    title: 'Another test blog',
    author: 'Tester',
    url: 'http://test.com',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

  const addedBlog = blogsAtEnd[blogsAtEnd.length - 1]

  assert.strictEqual(addedBlog.likes, 0)
})

test('a blog with a missing title and url does not get added', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const newBlog = {
    author: 'Tester',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map((b) => b.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  //creat and object to prepare the updated data
  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  }

  // capturing the response so I can verify the API response
  // databases can update but the api responses can stay the same
  // so it's important to check both have updated !
  const response = await api
    .put(`/api/blogs/${updatedBlog.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  // verify the API response reflects the update

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  assert.strictEqual(response.body.id, blogToUpdate.id)

  // verify the data base reflects the update
  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogFromDb = blogsAtEnd.find((b) => b.id === blogToUpdate.id)

  assert.strictEqual(updatedBlogFromDb.likes, blogToUpdate.likes + 1)
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

after(async () => {
  await mongoose.connection.close()
})
