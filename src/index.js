const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

app.listen((port), (error) => {
    if (error) return console.log('Error starting up express')
    console.log('Express is up and running on port', port)
})