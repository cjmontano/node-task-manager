const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const { 
    userOneId, 
    userOne, 
    userTwo, 
    taskOne, 
    setupDatabase 
} = require ('./fixtures/db')

// Runs prior to EVERY test
beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'From my test'
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should fetch all user two tasks', async () => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200)

    expect(response.body.length).toEqual(2)
})


test('Should not delete another users task', async () => {
    const path = '/tasks/' + taskOne._id
    console.log(path)

    const response = await request(app)
    .delete(path)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()

})
