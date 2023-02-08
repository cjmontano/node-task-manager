const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('users', {
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('\'password\' is not a valid selection')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim:true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        },
        lowercase: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    }
})

module.exports = User