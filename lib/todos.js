const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const todosFilePath = path.join(__dirname, '../todo','todo_data.json')

function readTodos() {
    return new Promise(function(resolve, reject) {
        fs.readFile(todosFilePath, 'utf-8', function(error, todos)  {
            if (error) {
                reject(error)
            } else {
                resolve(JSON.parse(todos))
            }
        })
    })
}

function createTodo(title, description) {
    const newTodo = {
        uuid: uuidv4(),
        title: title,
        description: description,
        created: Math.floor(new Date().getTime() / 1000),
        status: 'new'
    }

    return new Promise(function(resolve) {
        readTodos()
        .then(function(todos) {
            const updatedTodos = todos.concat(newTodo)
            writeTodo(updatedTodos)
        })
        .then(function(){
            resolve()
        })
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

        writeTodo(todo, cb)
    })
}

function writeTodo(todo) {
    const jsonEncodedTodos = JSON.stringify(todo)
    return new Promise(function(resolve, reject) {
        fs.writeFile(todosFilePath, jsonEncodedTodos, function(error) {
            if (error) {
                reject(error)
            } else {
                resolve({'status': 'written successfully'})
            }
        })
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
