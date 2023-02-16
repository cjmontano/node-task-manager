require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('63daebdf6bb574d82d40ba01', { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age: age })
    const count = await User.countDocuments({ age: age })
    return count
}

updateAgeAndCount('63e3ba6b36d5ab1703505b99', 33).then((count) => {
  console.log(count) 
}).catch((e) => {
    console.log(e)
})