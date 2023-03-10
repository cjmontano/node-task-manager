const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

//
// Without middleware:  new request -> run route handler
//
// With middleware:     new request -> do something -> run route handler
//

// app.use((req, res, next) => {
// if (req.method === 'GET') {
//    res.send('GET requests disabled')
// } else {
//     next()
// }
//     // console.log(req.method, req.path)
//     // next() // Lets express know we are done with this middleware function
// })

// Middleware for maintenance
// app.use((req, res, next) => {
//     res.status(503).send('Under Maintenance')
// })


app.use(express.json())
app.use(taskRouter)
app.use(userRouter)


app.listen((port), (error) => {
    if (error) return console.log('Error starting up express')
    console.log('Express is up and running on port', port)
})

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('640782bcd3b3b8565a9021b6')
//     // await task.populate(['owner']) //execPopulate is removed, array syntax required
//     // console.log(task.owner)

//     const user = await User.findById('64078319d3b3b8565a9021bb')
//     await user.populate(['myTasks'])
//     console.log(user.myTasks)

// }

// main()
