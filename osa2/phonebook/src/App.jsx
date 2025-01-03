import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Filter = ({ search, searchFunction }) => {
  return(
    <div>
      filter shown with <input value={search} onChange={searchFunction} />
    </div>
  )
}

const PersonForm = ({ submitFunction, name, nameF, number, numberF }) => {
  return(
    <form onSubmit={submitFunction}>
        <div>
          name: <input value={name} onChange={nameF} />
        </div>
        <div>
          number: <input value={number} onChange={numberF} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form> 
  )
}

const Person = ({ name, number, deleteContact }) => {
  return(
    <div>
      {name} {number} <button onClick={deleteContact}>delete</button>
    </div>
  )
}

const Persons = ({ persons, search, deleteContact }) => {
  return(
    persons.filter(p => p.name.toLowerCase().includes(search)).map(person => 
      <Person 
        key={person.name} 
        name={person.name} 
        number={person.number}
        deleteContact={() => deleteContact(person.id)}/>
    )
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='message'>
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialList => {
        setPersons(initialList)
      })
  }, [])

  const addContact = (event) => {
    event.preventDefault()

    if (persons.map(p => p.name).includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook. Replace the old number with a new one?`)) {
        const contact = persons.find(n => n.name === newName)
        const changedContact = { ...contact, number: newNumber }
        personService
          .update(contact.id, changedContact)
          .then(returned => {
            setPersons(persons.map(n => n.id === contact.id ? returned : n))
            setNewName('')
            setNewNumber('')
            setMessage(`Changed number for ${returned.name}`)
            setTimeout(() => { setMessage(null) }, 5000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => { setErrorMessage(null) }, 5000)
            setNewName('')
            setNewNumber('')
            setPersons(persons.filter(n => n.id !== contact.id))
          })
        return
      }
    }
    const nameObject = {
      name: newName,
      number: newNumber
    }
    personService
      .create(nameObject)
      .then(returnedContact => {
        setPersons(persons.concat(returnedContact))
        setNewName('')
        setNewNumber('')
        setMessage(`Added ${returnedContact.name}`)
        setTimeout(() => { setMessage(null) }, 5000)
      })
  }

  const deleteContact = (id) => {
    const contact = persons.find(n => n.id === id)
    if (window.confirm(`Delete ${contact.name}?`)) {
      personService
        .deletePerson(id)
        .then(deleted => {
          setPersons(persons.filter(n => deleted.id !== n.id))
        })
    }
  }

  const handleName = (event) => {
    setNewName(event.target.value)
  }

  const handleNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <ErrorNotification message={errorMessage} />
      <Filter search={newSearch} searchFunction={handleSearch} />
      <h2>Add a new</h2>
      <PersonForm submitFunction={addContact} name={newName} nameF={handleName}
        number={newNumber} numberF={handleNumber} />
      <h2>Numbers</h2>
      <Persons persons={persons} search={newSearch} deleteContact={deleteContact} />
    </div>
  )
}

export default App