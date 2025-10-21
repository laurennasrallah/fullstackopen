import React from 'react'

 const PersonForm = ({newName, setNewName, newNumber, setNewNumber, addPerson}) => {
    return (
        <form onSubmit={addPerson}>
        <h2>add a new</h2>
        <div>
          name: <input 
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
           />
        <div>
           number: <input
           value={newNumber}
           onChange={(event) => setNewNumber(event.target.value)}
           />
        </div>
          <button type="submit">add</button>
        </div>
      </form>

    )
 }
 
 export default PersonForm
 
 
 
 
 