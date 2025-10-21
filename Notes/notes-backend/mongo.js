const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const newContent = process.argv[3]
const newImportant = process.argv[4]

const url = `mongodb+srv://lauren:${password}@cluster0.4ngmyh3.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: newContent,
  important: newImportant,
})

note.save().then((result) => {
  console.log('note saved!')
  //   mongoose.connection.close()
})

Note.find({}).then((result) => {
  console.log('these are my notes:')
  result.forEach((note) => {
    console.log(`${note.content}, ${note.impor}`)
  })
  mongoose.connection.close()
})
