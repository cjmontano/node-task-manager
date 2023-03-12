const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
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
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('myTasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//This is a function that gets called when user is "stringify'd' such as res.send()
userSchema.methods.toJSON = function () {
    const user = this
    const publicUser = user.toObject()

    delete publicUser.password
    delete publicUser.tokens

    return publicUser
}

//Methods are run on instances ('user' vs 'User'); which is why we can't use arrow function
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'billygoattavern')

    user.tokens = user.tokens.concat({ token: token }) //concat adds an entry to the array
    await user.save()

    return token
}

//Statics are run on models ('User' vs 'user')
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })    
    if(!user) throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch)  throw new Error('Unable to login')

    return user
}

// Hash the plain text password before saving (need 'this'; hence no arrow function)
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete user tasks after user deletes him/herself
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema )

module.exports = User