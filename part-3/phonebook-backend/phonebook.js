const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let contacts = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/api/contacts', (request, response) => {
  response.json(contacts)
})

app.get('/info', (request, response) => {
  response.send(`<h2>Phonebook has info for ${contacts.length} people</h2>
    <p>${new Date()}</p>
    `)
})

app.post('/api/contacts', (request, response) => {
  const contact = request.body

  if (!contact.name || !contact.number) {
    return response.status(400).json({
      error: 'name or number missing',
    })
  }

  const nameExists = contacts.some((c) => c.name === contact.name)
  console.log(nameExists)
  if (nameExists) {
    return response.status(409).json({
      error: 'name must be unique',
    })
  }

  const generateId = () => {
    const maxId =
      contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) : 0
    return maxId + 1
  }

  const newContact = {
    id: generateId(),
    name: contact.name,
    number: contact.number,
  }

  contacts = contacts.concat(newContact)
  response.status(201).json(newContact)
})

app.get('/api/contacts/:id', (request, response) => {
  const id = Number(request.params.id)
  const contact = contacts.find((contact) => contact.id === id)

  if (contact) {
    response.json(contact)
  } else {
    response.status(404).json({ eeror: 'id does not exist' })
  }
})

app.delete('/api/contacts/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter((contact) => contact.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
