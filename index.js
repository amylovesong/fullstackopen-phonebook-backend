const express = require('express')
const app = express()

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  console.log('request id:', id, 'find result:', person)

  if (person) {
    response.json(person)
  } else {
    response.status(404).send(`No person found for id: ${id}, please check it`)
  }
})

app.get('/info', (request, response) => {
  const info = `Phonebook has info for ${persons.length} people`
  const time = new Date()
  response.send(`<div>${info}</div>
    <br/>
    <span id="time">${time}</span>`
  )
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
