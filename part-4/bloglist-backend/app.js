const mongoose = require('mongoose')
const config = require('./utils/config')
const express = require('express')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')

const app = express()
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(middleware.errorHandler)

app.get('/test', (req, res) => {
  res.send('working')
})

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)

module.exports = app
