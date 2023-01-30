// CRUD: Operations for Create Read Update Delete

// const mongodb = require('mongodb-legacy')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectId
const { MongoClient, ObjectId } = require('mongodb-legacy') // destructured three commented out lines above

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectId()
// console.log(id.id.length)
// console.log(id.getTimestamp())
// console.log(id.toHexString().length)

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    console.log(error)
    return console.log('Unable to connect to database.')
  }

  const db = client.db(databaseName)

  // db.collection('users').findOne({
  //   _id: new ObjectId('63d7d83eaa90d247d97f0909')
  // }, (error, result) => {
  //   if (error) return console.log('Unable to find user')
  //   console.log(result)
  // })

  db.collection('users').find({ age: 46 }).toArray((error, users) => {
    console.log(users)
  })

  // db.collection('users').insertOne({
  //   _id: id,
  //   name: 'Bernie',
  //   age: 46
  // }, (error, result) => {
  //   if (error) return console.log('Unable to insert.')
  //   console.log('inserted:', result.insertedId)
  // })

  // db.collection('users').insertMany([
  //   {
  //     name: 'Jen',
  //     age: 28
  //   }, {
  //     name: 'Gunther',
  //     age: 27
  //   }
  // ], (error, result) => {
  //   if (error) return console.log('Unable to insert many')
  //   console.log('inserted', result.insertedIds)
  // })

  // db.collection('tasks').insertMany([
  //   {
  //     description: 'take out the trash',
  //     completed: true
  //   }, {
  //     description: 'Setup new MBP',
  //     completed: false
  //   }, {
  //     description: 'pay mortgage',
  //     completed: false
  //   }
  // ], (error, result) => {
  //   if (error) return console.log('Unable to insert many')
  //   console.log('inserted', result.insertedIds)
  // })
})