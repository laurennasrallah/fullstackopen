const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('user creation', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('a user has a valid name and password', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'validuser',
      name: 'Test User',
      password: 'secret123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtEnd.length, userAtStart.length + 1)

    // verify user name exists
    const usernames = userAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('an invalid user can not be added', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ab',
      name: 'Test User',
      password: 'xx',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(
      result.body.error.includes('username') ||
        result.body.error.includes('password'),
    )

    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtEnd.length, userAtStart.length)
  })

  test('creation fails with proper statuscode if username already exists', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'kitty',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('username'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
