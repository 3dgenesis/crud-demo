const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const todosFilePath = path.join(__dirname, '../todo','todo_data.json');

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

async function createTodo(title, description) {
    const newTodo = {
        uuid: uuidv4(),
        title: title,
        description: description,
        created: Math.floor(new Date().getTime() / 1000),
        status: 'new'
    };

    const todos = await readTodos();
    todos.concat(newTodo)
    await writeTodo(todos)
}


async function updateTodo(uuid, title, description) {
    const todos = await readTodos()
    const foundIndex = todos.findIndex(todo => todo.uuid === uuid);
    if (foundIndex === -1) {
        throw new Error('Todo is not found')
    }

    todos[foundIndex]['title'] = title;
    todos[foundIndex]['description'] = description;
    await writeTodo(todos);
}

function writeTodo(todo) {
    const jsonEncodedTodos = JSON.stringify(todo);

    return new Promise(function(resolve, reject) {
        fs.writeFile(todosFilePath, jsonEncodedTodos, function(error) {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        })
    })
}

async function deleteTodo(uuid) {
    const todos = await readTodos();
    const isExists = todos.find(todo => todo.uuid === uuid);

    if (!isExists) {
        throw new Error('Todo is not found')
    }

    const updatedTodos =  todos.filter(todo => todo.uuid !== uuid);

    await writeTodo(updatedTodos);
}

module.exports = {
    createTodo,
    readTodos,
    updateTodo,
    writeTodo,
    deleteTodo
}
