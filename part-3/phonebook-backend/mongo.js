const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const newPerson = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://lauren:${password}@cluster0.4ngmyh3.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
  name: newPerson,
  number: newNumber,
})

contact.save().then((result) => {
  console.log(`added ${contact.name} number ${contact.number} to phonebook`)
  //   mongoose.connection.close()
})

Contact.find({}).then((result) => {
  console.log('phonebook:')
  result.forEach((contact) => {
    console.log(`${contact.name}, ${contact.number}`)
  })
  mongoose.connection.close()
})
