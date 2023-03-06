const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/test', (req, res) => {
    res.send('From a new file')
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// Get all Users
// router.get('/users', auth, async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (e) {
//         res.status(500).send(e)
//     }

//     // User.find({}).then((users) => {
//     //     res.send(users)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) return res.status(404).send('User not found')
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
    // User.findById(_id).then((user) => {
    //     if (!user) {
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(400).send()
    // })
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((item) => { return allowedUpdates.includes(item) })
    
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid User Updates!' })
    }

    try {
        const user = await User.findById(req.params.id)

        updates.forEach((item) => user[item] = req.body[item])
        await user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { 
        //     new: true, 
        //     runValidators: true
        // })

        if (!user) return res.status(404).send('User not found')

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) return res.status(404).send('User not found')
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }

    // Promise Chaining instead of async/await
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
        // res.send({ user: user.getPublicProfile(), token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        //return false, effecively saying, add nothing back to the tokens array
        req.user.tokens = req.user.tokens.filter((token) => {
            return false
        })
        // req.user.tokens = [] // simpler way to zero out tokens array
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router