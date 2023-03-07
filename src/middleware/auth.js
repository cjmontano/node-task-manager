const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        // first get just the token being sent in (less "Bearer ")
        const token = req.header('Authorization').replace('Bearer ', '')
        //then verify token using same 'salt'  we setup earlier
        const decoded = jwt.verify(token, 'billygoattavern')
        //then (hopefully) find user in mongod, based on token
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token}) 

        // if user does not exist, goodbye!
        if (!user) {
         throw new Error()   
        }

        // These next two lines are hugely important!
        // They create an object on req itself; which is carried around in other parts of code
        // This gives us access to req.token and req.user elsewhere (instead of req.param_id, for example)
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({error: 'Please Authenticate'})
    }
}

module.exports = auth