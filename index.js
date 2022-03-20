require("dotenv").config()

const winston = require('winston');
const { splat, combine, timestamp, printf } = winston.format;

const express = require("express")
const bodyParser = require("body-parser")
const {StatusCodes} = require("http-status-codes")
const { v4: uuidv4 } = require("uuid")

const app = express()
const listenPort = process.env.LISTEN_PORT

const { createTodo, readTodos, updateTodo, deleteTodo } = require("./lib/todos")
const { AppError } = require("./lib/classes/AppError")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())


// Event log

const eventFormat = printf( ({ timestamp, level, method, url, statusCode, message, requestId}) => {
    return `${timestamp} ${level}: method: ${method} -> ${statusCode} ${url} ${message}, requestId: ${requestId}`;
})

const errorFormat = printf( ({ timestamp, level, message, requestId}) => {
    return `${timestamp} ${level}: ${message}, requestId: ${requestId}`;
});

const eventLogger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: 'events.log', level: 'error',
            format: combine(
                timestamp(),
                errorFormat
            ),
        }),
        new winston.transports.File({
            filename: 'events.log', level: 'http',
            format: combine(
                timestamp(),
                eventFormat
            ),
        }),
    ],
})

function logEvents(request, response, next){
    request.id = uuidv4()

    eventLogger.log({
        level: 'http',
        method: request.method,
        url: request.url,
        statusCode: response.statusCode,
        message: 'ohh',
        requestID: request.uuid
    })

    next()
}

app.use(logEvents);

// CRUD



// Create
app.post("/api/todos",  function(request, response, next) {
   const { title, description } = request.body

    if (!title || !description) {
        return next( new AppError(
            "Missing field; description or title",
            StatusCodes.BAD_REQUEST, 
            `title: ${!title}, description: ${!description}`
        ))
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
            })
    })
})

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
        })
    })
})

// Update
app.put("/api/todos", function(request, response, next) {
    const { uuid, title, description } = request.body

    if (!uuid || !title || !description) {
        return next( new AppError(
            "Bad query: uuid, title or description missing",
            StatusCodes.BAD_REQUEST, 
            `uuid: ${!uuid}, title: ${!title}, description: ${!description}`
        ))
    }

    updateTodo(uuid, title, description, function callback(error) {
        if (error) return next(error)

        return response.json({
            error: null, 
            data:[{
                message: "Todos updated successfully"
            }]
        })
    })
})

// Delete
app.delete("/api/todos/", function(request, response, next) {

    const { uuid } = request.query

    if (!uuid) {
        return next( new AppError(
            "Bad query: uuid missing",
            StatusCodes.BAD_REQUEST, 
            `uuid: ${!uuid}`
        ))
    }
        
    deleteTodo(uuid, function callback(error) {
        if (error) return next(error) 

        return response.json({
            error: null, 
            data:[{
                message: "Todos deleted successfully",
                todos: todos
            }]
        })
    })
})

function errorHandler(error, request, response, next) {
    if (!error) {
        return next()
    }

    console.log(
        `Error name: ${error.name}, `,
        `Error code: ${error.statusCode}, `,
        `error message: ${error.message}, `,
        `error reference ID: ${request.id}, `,
        `additional data: ${error.data}`
    )

    eventLogger.log({
        level: 'error',
        message: error.message,
        requestId: request.id
    });

    return response
        .status(error.statusCode || 500)
        .json({
            error: [{
                statusCode: error.statusCode,
                message: error.message,
                requestId: request.id
            }],
            data: null
        })
}

app.use(errorHandler)

app.listen(listenPort, function() {
    console.log(`http://localhost:${listenPort}`)
})