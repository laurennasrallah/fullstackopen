import React from 'react'

const Person = ({person, removeContact}) => {
    return (
     <li key={person.id}>  {person.name} {person.number}
     <button onClick={removeContact}>delete</button>
     </li>
    )
}

export default Person


