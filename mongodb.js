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

  db.collection('users').deleteMany({
    age: 46
  }).then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })

  db.collection('tasks').deleteMany({
    description: 'take out the trash'
  }).then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })

  // const updatePromise = db.collection('users').updateOne({
  //   _id: new ObjectId('63d7d933451d23b155a55200')
  // }, {
  //   $set: {
  //     name: 'CJ'
  //   }
  // })

  // updatePromise.then((result) => {
  //   console.log(result)
  // }).catch((error) => {
  //   console.log(error)
  // })

  // // chains the two separate statements above into a single promise call
  // db.collection('users').updateOne({
  //   _id: new ObjectId('63d7d933451d23b155a55200')
  // }, {
  //   $set: {
  //     name: 'Sarah'
  //   },
  //   $inc: {
  //     age: 1
  //   }
  // }).then((result) => {
  //   console.log(result)
  // }).catch((error) => {
  //   console.log(error)
  // })

  // // only difference with updateMany is it matches all, instead of the 'first' instance
  // db.collection('tasks').updateMany({
  //   completed: false
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }).then((result) => {
  //   console.log(result.modifiedCount)
  // }).catch((error) => {
  //   console.log(error)
  // })

  // db.collection('users').findOne({
  //   _id: new ObjectId('63d7d83eaa90d247d97f0909')
  // }, (error, result) => {
  //   if (error) return console.log('Unable to find user')
  //   console.log(result)
  // })

  // db.collection('users').find({ age: 46 }).toArray((error, users) => {
  //   console.log(users)
  // })
  
  // db.collection('users').find({ age: 46 }).count((error, count) => {
  //   console.log('number of users found:', count)
  // })

  // db.collection('tasks').findOne({ 
  //   _id: new ObjectId('63d7d83eaa90d247d97f090c') 
  // }, (error, result) => {
  //   if (error) return console.log('Could not find ID')
  //   console.log(result)
  // })

  // db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
  //   if (error) return console.log("Error on on find")
  //   console.log(tasks)
  // })

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
