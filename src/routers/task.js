const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/tasks', auth, async (req, res) => {
    try {
        // find only tasks for user that made request
        const tasks = await Task.find({owner: req.user._id})

        if (!tasks) {
            res.status(404).send('No tasks found')
        }

        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        // Uses 'owner' reference setup in task model
        const task = await Task.findOne({_id, owner: req.user._id})
        
        if (!task) {
            return res.status(404).send('Task not found')
        }

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }

    // Promise Chaining
    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((item) => { return allowedUpdates.includes(item) })
    
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Task Updates!' })
    }

    try {
        const task = await Task.findById(req.params.id)

        updates.forEach((item) => {
            task[item] = req.body[item]
        })
        await task.save()
        
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { 
        //     new: true, 
        //     runValidators: true
        // })

        if (!task) { 
            return res.status(404).send('Task not found')
        }

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) return res.status(404).send('Task not found')
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/tasks', auth, async (req, res) => {
    // we get both the body, and the user ID copied into a new Task
    // user ID is not part of the request, but it is in the auth middleware
    // '...' syntax is ES6 spread operator 
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }

    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

module.exports = router