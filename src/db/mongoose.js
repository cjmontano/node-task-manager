const mongoose = require('mongoose')

mongoose.set('strictQuery', true) // Suppresses warnings, must be called b4 .connect()

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    // useNewUrlParser: true, //DEPRECATED, not needed
    // useCreateIndex: true   //DEPRECATED, not needed
    // useFindAndModify: false
})