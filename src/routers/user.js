const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

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

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { 
        //     new: true, 
        //     runValidators: true
        // })

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
        // res.send({ user: user.getPublicProfile(), token }) //explicit call
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

// unneeded route, because we don't want to allow anyone to get anyone's info, just their own
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         if (!user) return res.status(404).send('User not found')
//         res.status(200).send(user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
//     // User.findById(_id).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(400).send()
//     // })
// })

module.exports = router