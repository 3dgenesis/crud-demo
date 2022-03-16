require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const {StatusCodes} = require("http-status-codes");
const { v4: uuidv4 } = require("uuid")

const app = express()
const listenPort = process.env.LISTEN_PORT

const { createTodo, readTodos, updateTodo, deleteTodo } = require("./lib/todos")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// CRUD

// Create
app.post("/api/todos",  function(request, response, next) {
   const { title, description } = request.body

    if (!description || !title) {
        const error = new Error("Missing field; description or title")
        error.statusCode = StatusCodes.BAD_REQUEST
        return next(error)
    }

    createTodo(title, description, function callback(error) {
        if (error) return next(error)

        return response
            .status(StatusCodes.CREATED)
            .json({
                error: null, 
                data:[{
                    message: "Todo created successfully"
                }]
            });
    })
});

// Read
app.get("/api/todos",  function(_request, response, next) {
    readTodos(function callback(error, todos) {
        if (error) return next(error)

        return response.json({
            error: null, 
            data:[{
                message: "Todos received successfully",
                todos: todos
            }]
        });
    })
});

// Update
app.put("/api/todos", function(request, response, next) {
    const { uuid, title, description } = request.body

    if (!uuid || !title || !description) {
        const error = new Error("Bad query: uuid, title or description missing")
        error.statusCode = StatusCodes.BAD_REQUEST
        return next(error)
    }

    updateTodo(uuid, title, description, function callback(error) {
        if (error) return next(error)

        return response.json({
            error: null, 
            data:[{
                message: "Todos updated successfully",
                todos: todos
            }]
        });
    })
})

// Delete
app.delete("/api/todos/", function(request, response, next) {

    const { uuid } = request.query

    if (!uuid) {
        const error = new Error("Bad query: uuid missing")
        error.statusCode = StatusCodes.BAD_REQUEST
        return next(error)
    }
        
    deleteTodo(uuid, function callback(error) {
        if (error) return next(error) 

        return response.json({
            error: null, 
            data:[{
                message: "Todos deleted successfully",
                todos: todos
            }]
        });
    })
})


function errorHandler(error, request, response, next) {
    if (!error) {
        return next()
    }

    error.referenceId = uuidv4()

    console.log(
        `Error code: ${error.statusCode}, error message: ${error.message}, error reference ID: ${error.referenceId}`
    )

    response
        .status(error.statusCode || 500)
        .json({
            error: [{
                statusCode: error.statusCode,
                message: error.message,
                referenceId: error.referenceId
            }],
            data: null
        });
}

app.use(errorHandler)

app.listen(listenPort, function() {
    console.log(`http://localhost:${listenPort}`)
})
