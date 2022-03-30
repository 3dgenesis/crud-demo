const fs = require('fs');
const { __esModule } = require('uuid');

function readFile(path, encoding='utf-8') {
    return new Promise(function(resolve, reject) {
        fs.readFile(path, encoding, function(error, data) {
            if (error) {
                reject(error)
            } else {
                resolve(data)
            }
        })
    })
}

/* console.log(1)

const abc = readFile(__dirname +'/todos.js');

abc.then(function(data) {
    console.log(data)
})
console.log('#################################');
abc.catch(function(error) {
    console.error('hello ', error)
});

*/

module.exports = { readFile }
