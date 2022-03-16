require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const {StatusCodes} = require('http-status-codes');

const app = express()
const port = process.env.CUSTOM_PORT

const { createTodo, readTodos, updateTodo, deleteTodo } = require('./lib/todos')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// CRUD

// Create
app.post('/api/todos',  function(request, response, next) {
   const { title, description } = request.body

    if (!description || !title) {
            response.status(StatusCodes.BAD_REQUEST)
        return next(new Error('Missing field; description or title'))
    }

    createTodo(title, description, function callback(error) {
        if (error) return next(error)

        response.status(StatusCodes.CREATED)
        return response.json({ status: 'sucsess', message : 'Todo added successfully'});
    })
});

// Read
app.get('/api/todos',  function(_request, response, next) {
    readTodos(function callback(error, todos) {
        if (error) return next(error)

        response.status(StatusCodes.OK)
        return response.json(todos)
    })
});

// Update
app.put('/api/todos', function(request, response, next) {
    const { uuid, title, description } = request.body

    if (!uuid || !title || !description) {
        response.status(StatusCodes.BAD_REQUEST)
        return next(new Error('Bad query: uuid, title or description missing'))
    }

    updateTodo(uuid, title, description, function callback(error) {
        if (error) return next(error)

        response.status(StatusCodes.OK)
        return response.json({ status: 'sucsess', message : 'Todo updated successfully'})
    })
})

// Delete
app.delete('/api/todos/', function(request, response, next) {

    const { uuid } = request.query

    if (!uuid) {
        response.status(StatusCodes.BAD_REQUEST)
        return next(new Error('Bad query: uuid missing'))
    }
        
    deleteTodo(uuid, function callback(error) {
        if (error) throw error

        response.status(StatusCodes.OK)
        return response.json({ status: 'sucsess', message : 'Todo deleted successfully'})
    })
})

app.use((error, request, response, next) => {
    console.log('Error status')
})

app.use( function errorHandler(error, request, response, next) {
    console.log('Error here')
})

    app.listen(port, function() {
    console.log(`http://localhost:${port}`)
})
