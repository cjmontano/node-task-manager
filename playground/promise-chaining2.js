require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('63dae3046b6eff96351b4d36').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id)    // await will not work if f(x) does not return a promise
    const count = await Task.countDocuments({ completed: false })
    return count
}

const updateCompletedAndCount = async (id, completed) => {
    await Task.findByIdAndUpdate(id, { completed })
    const count = await Task.countDocuments({ completed: true })
    return count
}

deleteTaskAndCount('63daedce06ce74aa4e1a3b88').then((count) => {
    console.log('False count(before update):', count)
}).catch((e) => {
    console.log(e)
})

updateCompletedAndCount('63e3c31eaff9d920a7756292', true).then((count) => {
    console.log('True count(after update):', count)
}).catch((e) => {
    console.log(e)
})