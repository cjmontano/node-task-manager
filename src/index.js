const app = require ('./app')
const port = process.env.PORT

app.listen((port), (error) => {
    if (error) return console.log('Error starting up express')
    console.log('Express is up and running on port', port)
})