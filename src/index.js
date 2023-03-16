const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// Without middleware:  new request -> run route handler
// With middleware:     new request -> do something -> run route handler

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

const multer = require('multer')
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.doc[x]{0,1}$/)) { //alternate regex '\.(doc|docx)$'
            return cb(new Error('Please upload a word document'))
        }
        cb(undefined, true)
        // cb(new Error('File must be a PDF'))
        // cb(undefined, true)
        // cb(undefined, false)
    }
})

const errorMiddleware = (req, res, next) => {
    throw new Error('From my middleware')
}

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

app.listen((port), (error) => {
    if (error) return console.log('Error starting up express')
    console.log('Express is up and running on port', port)
})