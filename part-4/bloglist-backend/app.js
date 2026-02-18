const mongoose = require('mongoose')
const config = require('./utils/config')
const express = require('express')
const blogsRouter = require('./controllers/blogs')

const app = express()
app.use(express.json())
app.use('/api/blogs', blogsRouter)

app.get('/test', (req, res) => {
  res.send('working')
})

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)

module.exports = app
