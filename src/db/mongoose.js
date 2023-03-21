const mongoose = require('mongoose')

mongoose.set('strictQuery', true) // Suppresses warnings, must be called b4 .connect()

mongoose.connect(process.env.MONGODB_URL, {
    // useNewUrlParser: true, //DEPRECATED, not needed
    // useCreateIndex: true   //DEPRECATED, not needed
    // useFindAndModify: false
})
