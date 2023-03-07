const mongoose = require('mongoose')

// const taskSchema = new mongoose.Schema({
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
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

// taskSchema.pre('save', async function (next) {
//     const task = this
//     console.log('just before saving task')
//     next()
// })

// const Task = mongoose.model('Task', taskSchema)

module.exports = Task