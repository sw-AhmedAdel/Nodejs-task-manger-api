const request = require('supertest');
const app = require('../../app');
const users = require('../../models/users.mongo');
 

const {
  userOne,
  user_id,
  setupMongo
} = require('../setup.databaseTest');

require('dotenv').config();

const {  startMongo ,
         disconnectMongo,
}= require('../../services/mongo');
 


describe('Test task manger' , () => {

  // open mongo before testing
  beforeAll( async ()=>{
    await startMongo();
  })

  //close mongo after testing
  afterAll(async ()=>{
    await disconnectMongo();
  })

 beforeEach(setupMongo)

  const createUser = {
    email: "sw.ahmdedd@gmail.com",
    age: 0,
    name: "ahmed",
    password: "ahmed1234"
  }
  describe('Post new user',  () => {
    test('it should respond with 201 success' , async ()  =>{
     const response = await request(app)
    .post('/v1/users')
    .send(createUser)
    .expect(201)

    const user = await users.findById(response.body.newUser._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
      newUser:{
        email: "sw.ahmdedd@gmail.com",
      },
      token: user.tokens[0].token
    })
  }) 
   
  })

  //------login  using saveUser 
    describe('Test login user existing in mongo' ,() => {
    test('it should respond with 200 success' , async () => {
     const response = await request(app)
     .post('/v1/users/login')
     .send({
      email:userOne.email,
      password:userOne.password
     })
     .expect(200)

     const user = await users.findById(user_id);
     expect(response.body.token).toBe(user.tokens[1].token)
   }) 
  })

  describe('Test login Failed ' , () => {
    test('it should respond with 400 Bad request' , async() => {
      const response = await request(app)
      .post('/v1/users/login')
      .send({
        email:"moneky@gmail.com",
        password:userOne.password
      }).expect(400);

      expect(response.body).toStrictEqual({
        error:"unable to login",
      })
    })
  })


  describe('test authenticate user to get his profile ' , () => {
     test('it should respond with 200 success', async () => {
      const response = await request(app)
      .get('/v1/users/profile')
      .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
      .expect(200);
     })
  })


  describe('test not authenticate user to get profile does not exist' , () => {
    test('it should respond with 401 failed', async () => {
     const response = await request(app)
     .get('/v1/users/profile')
     .expect(401);
    })
 })

 userOne.password= 'monkeyMonkey11'
 describe('test authenticate user to change his password' , () => {
  test('it should respond with 200 success', async() => {
   const response = await request(app)
   .put('/v1/users/me')
   .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
   .send({
     password:userOne.password
   })
   .expect(200)
  })
 })

 describe('Test login user existing in mongo after changing the password' ,() => {
  test('it should respond with 200 success' , async () => {
   const response = await request(app)
   .post('/v1/users/login')
   .send({
    email:userOne.email,
    password:userOne.password
   })
   .expect(200)

   const user = await users.findById(user_id);
   expect(response.body.token).toBe(user.tokens[1].token)
 }) 
})
 describe('test delete authenticate user ' , () => {
   test('it should respond with 200 success', async() => {
     const response = await request(app)
     .delete('/v1/users/me')
     .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
     .expect(200);

     const user = await users.findById(user_id);
     expect(user).toBeNull();
   })
 })

 describe('test not authenticate user to delete his profile does not exist ' , () => {
  test('it should respond with 401 failed', async () => {
   const response = await request(app)
   .delete('/v1/users/me')
   .expect(401);

   expect(response.body).toStrictEqual({
    error:"please authenticate"
   })
  })
})

 describe('should upload avatar' , () => {
  test('it should respond with 200 sucess', async () => { 
   const response = await request(app)
   .post('/v1/users/my/avatar')
   .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
   .attach('avatar' , 'src/routes/users/fixtures/pic.jpg')
   .expect(200);

   const user = await users.findById(user_id);
   expect(user.avatar).toEqual(expect.any(Buffer))
  })
 })
})
