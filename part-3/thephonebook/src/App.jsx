import { useState, useEffect } from 'react'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Person from './components/Person.jsx'
import contactService from './services/contacts.js'
import Notification from './components/Notification.jsx'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    console.log('effect')
    contactService.getAll().then((response) => {
      console.log('promise fulfilled')
      setPersons(response.data)
    })
  }, [setPersons])

  const addPerson = (event) => {
    event.preventDefault() // event has a default action - this tells it not to do the default

    const existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson) {
      // if person exists
      const confirmUpdate = window.confirm(
        `${existingPerson.name} already exists - would you like to update their details?`
      ) // call window.confirm to store its boolean

      if (confirmUpdate) {
        // this will be true if the user clicks OK
        const updatedPerson = {
          ...existingPerson,
          number: newNumber,
        }

        contactService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            const newPersonsArray = persons.map((person) => {
              // creates a new person array
              if (person.name === existingPerson.name) {
                // check if this is the person we want to update
                return updatedPerson // if it is, return the newly updated person
              } else {
                return person // if not, return the original person object unchanged
              }
            })

            setPersons(newPersonsArray) // Update the state with the new array
            console.log('Updated person:', updatedPerson)
            console.log('New persons array after update:', newPersonsArray)
          })
        setMessage(`${updatedPerson.name} number has been changed`)
        setIsSuccess(true)
        setTimeout(() => {
          setMessage(null)
          setIsSuccess(false)
        }, 5000)
      }
      // if user cancels, nothing happens within this block
    } else {
      // logic for adding a new person if they do not already exist
      const personObject = { name: newName, number: newNumber }
      console.log('Adding person:', personObject)

      setPersons(persons.concat(personObject))
      console.log('Update persons:', persons.concat(personObject))

      // this then updates the server with the new person
      contactService.create(personObject).then((response) => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setMessage(`${personObject.name} has been added`)
        setIsSuccess(true)
        setTimeout(() => {
          setMessage(null)
          setIsSuccess(false)
        }, 10000)
      })
    }

    // clear input fields
    setNewName('')
    setNewNumber('')
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  let personToShow = []

  if (filter === '') {
    personToShow = persons
  } else {
    personToShow = persons.filter((person) => {
      return person.name.toLowerCase().includes(filter.toLowerCase())
    })
  }

  const removeContactById = (id) => {
    const personToRemove = persons.find((person) => person.id === id)
    if (window.confirm(`Delete ${personToRemove.name}?`)) {
      contactService
        .remove(id)
        .then((response) => {
          console.log(response)
          setPersons(persons.filter((person) => person.id !== id)) // filtering out the removed person
          console.log(persons)
        })
        .catch((error) => {
          setMessage(
            `Information of ${personToRemove.name} has already been removed from the server`
          )
          setIsSuccess(flase)
          setTimeout(() => {
            setMessage(null)
          }, 500)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isSuccess={isSuccess} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <ul>
        {persons.map((person) => (
          <Person
            key={person.id}
            person={person}
            removeContact={() => removeContactById(person.id)}
          />
        ))}
      </ul>

      <div>
        debug: {newName} {filter}
      </div>
    </div>
  )
}

export default App
