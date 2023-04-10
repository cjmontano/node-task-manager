const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Eva',
    email: 'eva.diva@example.com',
    password: 'MyPass777',
    age: '12',
    tokens: [{
        token: jwt.sign( { _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should create a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Lyla',
        email: 'lyla.montano@lylaboink.com',
        password: 'MyPass777'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Lyla',
            email: 'lyla.montano@lylaboink.com',
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('MyPass777')

})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    //Asserts the second token
    const user = await User.findById(userOne._id)
    expect(response.body).toMatchObject({
        token: user.tokens[1].token
    })
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email + 'additional text',
        password: userOne.password
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete user', async () => {
    const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
    .send()
    .expect(200)

    expect(userOne._id.toString()).toBe(response.body._id)
    
    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test('Should not delete unauthenticated user', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})