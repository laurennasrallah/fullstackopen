const app = require('./app')
const mongoose = require('mongoose')

const mongoUrl =
  'mongodb+srv://lauren:banana123@cluster0.4ngmyh3.mongodb.net/blogApp?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(mongoUrl)

// Handles successful connection
mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB Atlas successfully!')
})

// Handles connection errors
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err)
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
