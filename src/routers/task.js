const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    try {
        const match = {}
        const sort = {}

        // Filtering for tasks, by completion (i.e. '/tasks?completed=true')
        if(req.query.completed) {
            //set the value completed on match = true, only if req.query.complete = true, else false
            match.completed = req.query.completed === 'true'
        }

        if(req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            // must use array syntax since there are no name variables on the object
            // uses terniery operator (if parts[1] is 'desc', then -1, else 1)
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        
        //Pagination included as options
        await req.user.populate([{
            path: 'myTasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
            }
        }])
        const tasks = req.user.myTasks

        if (tasks.length === 0) {
            // must 'return' from here or you will get a HEADER error
            return res.status(404).send('No tasks found')
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