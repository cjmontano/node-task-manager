const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/tasks', auth, async (req, res) => {
    try {
        // find only tasks for user that made request
        
        // Option A: Referenced through Task
        // const tasks = await Task.find({owner: req.user._id})
        
        // Option B: Referenced through User 
        await req.user.populate(['myTasks'])
        const tasks = req.user.myTasks

        if (tasks.length === 0) {
            res.status(404).send('No tasks found')
        }

        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
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
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((item) => { return allowedUpdates.includes(item) })
    
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Task Updates!' })
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if (!task) { 
            return res.status(404).send('Task not found')
        }

        updates.forEach((item) => {
            task[item] = req.body[item]
        })

        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!task) { 
            return res.status(404).send('Task not found, sorry.')
        }

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
})

module.exports = router