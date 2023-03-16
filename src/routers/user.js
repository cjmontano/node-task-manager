const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')

// Returns the requesting users profile back to them with appropriate sensitive info filtered
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    
    // isValidOperation will pass if "every" 'key' in the req.body is included in allowedUpdates
    const isValidOperation = updates.every((item) => { 
        return allowedUpdates.includes(item) 
    })

    // Checks if isValidOperation is true (if any are false, we will not update any)
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid User Updates!' })
    }

    // Reaching this code means "it is ok to update", so we go find user and try to update
    try {
        // with auth middleware, no need to find the user (again) we already did!
        // const user = await User.findById(req.user._id)

        // for each item ('key') in the updates array, 
        // we want to update the user object@item with the incoming req.body@item before saving
        updates.forEach((item) => {
            req.user[item] = req.body[item]
        })

        // once that user array is updated, save it to the database
        await req.user.save()

        // With auth middleware, the next line is not needed, because we know the user exists!
        // if (!user) return res.status(404).send('User not found')

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Creates a user and also generatesAuthToken, so immediately logged in
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send('Could not authenticate \'' + req.body.email + '\'')
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

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { //regex to find proper file types
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined //frees up the data for memory collection?
    await req.user.save() // should this be in a try / catch block?
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router