const request = require('supertest');
const app = require('../../app');
const tasks = require('../../models/task.mongo');

const {
  userOne,
  user_id,
  setupMongo,
  userTwo,
  taskOne
} = require('../setup.databaseTest');

const { 
   startMongo ,
   disconnectMongo,
}= require('../../services/mongo');


describe('Test tasks' , () => {

  beforeAll(async () => {
    await startMongo();
  })

  afterAll(async () => {
    await disconnectMongo();
  })
  
  beforeEach(setupMongo);

  describe('test post new task' , () =>{
    test('it should responde with 201 success' , async () => {
      const response = await request(app)
      .post('/v1/tasks')
      .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
      .send({
        description:"clean the house"
      })
      .expect(201)

      const task = await tasks.findById(response.body._id);
      expect(task).not.toBeNull();
      expect(task.owner).toEqual(user_id);
      
    }) 
  })
  
  describe('test get user all tasks' , () => {
    test('it should responde with 200 success' , async () => {
    const response = await request(app)
    .get('/v1/tasks')
    .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

    expect(response.body.length).toEqual(2)
    })
  })

 
  describe('test get user all tasks' , () => {
    test('it should responde with 200 success' , async () => {
    const response = await request(app)
    .delete(`/v1/tasks/${taskOne._id}`)
    .set('Authorization' , `Bearer ${userTwo.tokens[0].token}`)
    .expect(400)

    })
  })

})
