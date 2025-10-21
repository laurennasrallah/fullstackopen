require('dotenv').config()
const express = require('express')
const Country = require('./models/country')
const morgan = require('morgan')

const app = express()

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello from the countries backend!</h1>')
})

app.get('/api/countries', (request, response) => {
  Country.find({}).then((countries) => {
    response.json(countries)
  })
})

app.get('/api/countries/names', (request, response) => {
  Country.find({}).then((countries) => {
    const countryNames = countries.map((country) => {
      return {
        name: country.name.common,
        _id: country._id,
      }
    })
    response.json(countryNames)
  })
})

app.get('/api/countries/:id', (request, response, next) => {
  Country.findById(request.params.id)
    .then((country) => {
      if (country) {
        response.json(country)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
