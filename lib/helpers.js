const { readFile } = require("./promiseFs");

function delayed(timeInMs) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeInMs);
    })
}

delayed(3000)
    .then(() => console.log('i am late'))
    .then(function() {
        return delayed(3000)
    })
    .then(() => readFile('text.txt'))
    .then(() => console.log('i am late2'),() => console.error('ERROR HAS OCCURRED!'))
    .catch()

