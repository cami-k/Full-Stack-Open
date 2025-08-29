const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())

morgan.token('body', function getBody (req) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

app.use(express.static('dist'))

let numbers = [
  {    
    id: "1",    
    name: "Arto Hellas",    
    number: "040-123456"  
  },
  {    
    id: "2",    
    name: "Ada Lovelace",    
    number: "39-44-56789"  
  },
  {    
    id: "3",    
    name: "Dan Abramov",    
    number: "12-34-56789"  
  },
  {    
    id: "4",    
    name: "Mary Poppendieck",    
    number: "39-23-1234567"  
  }
]

app.get('/api/persons', (request, response) => {
  response.json(numbers)
})

app.get('/info', (request, response) => {
  const entries = numbers.length
  const time = new Date()
  response.send(`
    <div>
    <h4>Phonebook has info for ${entries} people</h4>
    <h4>${time}</h4>
    </div>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const entry = numbers.find(entry => entry.id === id)
  
  if (entry) {
    response.json(entry)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  numbers = numbers.filter(entry => entry.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const id = String(Math.floor(Math.random() * 50))

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  if (numbers.map(entry => entry.name).includes(body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const entry = {
    id: id,
    name: body.name,
    number: body.number
  }

  numbers = numbers.concat(entry)

  response.json(entry)

})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})