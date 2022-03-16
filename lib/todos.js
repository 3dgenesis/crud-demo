const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const todosFilePath = path.join(__dirname, '../todo','todo_data.json')

function readTodos(cb) {
    fs.readFile(todosFilePath, 'utf-8', (error, data) => {
        if (error) return cb(error)
        if (!Array.isArray(JSON.parse(data))) return cb(new Error('Defective target file schemma: expected array'))

        cb(error, JSON.parse(data))
    })
}

function createTodo(title, description, cb) {
    const newTodo = {
        uuid: uuidv4(),
        title: title,
        description: description,
        created: Math.floor(new Date().getTime() / 1000),
        status: 'new'
    }

    readTodos((error, todos) => {
        if (error) return cb(error)

        const updatedTodos = todos.concat(newTodo)
        writeTodo(updatedTodos, cb)
    })
}


function updateTodo(uuid, title, description, cb) {
    readTodos((error, todos) => {
        if (error) return cb(error)
        const foundIndex = todos.findIndex(todo => todo.uuid === uuid)
        if (foundIndex === -1) {
           return cb(new Error('Todo is not found'))
        }

        todos[foundIndex]['title'] = title
        todos[foundIndex]['description'] = description

        writeTodo(todos, cb)
    })
}

function writeTodo(todos, cb) {
    const jsonEncodedTodos = JSON.stringify(todos)
    fs.writeFile(todosFilePath, jsonEncodedTodos, (error) => {
        if (error) {
            return cb(error)
        }

        cb(error, {'status': 'written successfully'})
    })
}

function deleteTodo(uuid, cb) {
    readTodos((error, todos) => {
        if (error) return cb(error)
        const isExists = todos.find(todo => todo.uuid === uuid)
        if (!isExists) {
           return cb(new Error('Todo is not found'))
        }
        
        const updatedTodos = todos.filter(todo => todo.uuid != uuid)

        writeTodo(updatedTodos, cb)
        
    })
}

module.exports = {
    createTodo,
    readTodos,
    updateTodo,
    writeTodo,
    deleteTodo
}
