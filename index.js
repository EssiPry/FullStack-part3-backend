require('dotenv').config()
const express = require('express')
const app = express()

const Person = require('./models/person')

const morgan = require(`morgan`)

//error handling middleware
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error:'malformatted id'})
    }

    next(error)
}

const cors = require(`cors`)

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())


const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
    }


morgan.token('msg', function(request){return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :msg'))


app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

/*
app.get('/info', (request, response) => {
    const no_persons = persons.length
    const d = new Date()
    response.send(`<p>Phonebook has info for ${no_persons} people</p> <p>${d}</p>`)
})
*/

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
       if (person) {
        response.json(person)
       } else {
        response.status(404).end()
       }
    })
    .catch(error => next(error))
})


app.post(`/api/persons`, (request, response) => {
    const body = request.body
    console.log(body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error:'name or number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})


app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})