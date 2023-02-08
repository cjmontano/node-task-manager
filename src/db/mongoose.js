const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    // useNewUrlParser: true, //DEPRECATED, not needed
    // useCreateIndex: true   //DEPRECATED, not needed
})

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    }
})

const myTask = new Task({
    description: ' Don\'t worry, Be happy!  ',
    completed: true
    //completed: false
})

myTask.save().then(() => {
    console.log(myTask)
}).catch ((error) => {
    console.log(error)
})

// const User = mongoose.model('users', {
//     name: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String,
//         required:true,
//         trim: true,
//         minlength: 7,
//         validate(value) {
//             if (value.toLowerCase().includes('password')) {
//                 throw new Error('\'password\' is not a valid selection')
//             }
//         }
//     },
//     email: {
//         type: String,
//         required: true,
//         trim:true,
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 throw new Error('Email is invalid')
//             }
//         },
//         lowercase: true
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if (value < 0) {
//                 throw new Error('Age must be a positive number')
//             }
//         }
//     }
// })

// const me = new User({
//     name: 'CJ',
//     age: 46,
//     email: 'Cornel.Montano@gmail.com',
//     // password: 'rubleduble',
//     // password: 'short' // Throws error since it is too short
//     password: 'Password123' // Throws error since not valid
//     // email: 'joejoe#' // Throws error since not an email
//     // age: -3 // Throws error defined in model
//     // age: 'forty six' // Does not work due to validation
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error!', error)
// })