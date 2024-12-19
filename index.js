require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/phonebook')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
// app.use(morgan('tiny'))

// create a morgan token to show the request body
morgan.token('request-body', function (req, res) {
  const reqMethod = req.method

  if (reqMethod === 'POST') {
    const body = req.body
    return JSON.stringify(body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))

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
  Person.find({}).then(persons => {
    response.json(persons)
  })
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

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number must not be empty'
    })
  }

  // if (persons.find(p => p.name === body.name)) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  const info = `Phonebook has info for ${persons.length} people`
  const time = new Date()
  response.send(`<div>${info}</div>
    <br/>
    <span id="time">${time}</span>`
  )
})

const errorHandler = (error, request, response, next) => {
  console.log('errorHandler:', error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  }
  
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
