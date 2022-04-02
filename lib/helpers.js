
function delayed(timeInMs, string) {
    return new Promise ((resolve) => setTimeout(() => resolve(string), timeInMs))
}

async function chainedDelays(){
    let foo = 'tot';
    foo = foo.concat(await delayed(3000, 'bzz'))
    console.log(foo)
    foo = foo.concat(await delayed(3000, 'rrr'))
    console.log(foo)
    foo = foo.concat(await delayed(3000, 'kek'))
    console.log(foo)
}

chainedDelays();

// delayed(3000)
//     .then(() => console.log('i am late1'))
//     .then(function() {
//         return delayed(3000)
//     })
//     .then(() => console.log('i am late2'))
//     .then(function() {
//         return delayed(3000)
//     })
//     .then(() => console.log('i am late3'))
//     .catch()