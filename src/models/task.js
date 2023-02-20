const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
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

taskSchema.pre('save', async function (next) {
    const task = this
    console.log('just before saving task')
    next()
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task