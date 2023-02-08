const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.listen((port), (error) => {
    if (error) return console.log('Error starting up express')
    console.log('Express is up and running on port', port)
})