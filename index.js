require('dotenv').config()
const express = require('express')
const app = express()
const Person = require(`./models/person`)

const morgan = require(`morgan`)

const cors = require(`cors`)

const mongoose = require(`mongoose`)

app.use(express.json())
app.use(express.static('dist'))
morgan.token('msg', function(request){return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :msg'))
app.use(cors())

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/info', (request, response) => {
    const no_persons = persons.length
    const d = new Date()
    response.send(`<p>Phonebook has info for ${no_persons} people</p> <p>${d}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

generateId = (max) => {
    return Math.floor(Math.random() * max)
}

app.post(`/api/persons`, (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error:'name or number missing'
        })
    }

    if (persons.find((person)=> person.name === body.name)) {
        return response.status(400).json({
            error:'name must be unique'
        })
    }

    const person = {
        id: generateId(10000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
