

const users = require('../models/users.mongo');
const tasks = require('../models/task.mongo');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const user_id = new mongoose.Types.ObjectId();
const userOne= {
  _id : user_id,
  email: "ahmded@gmail.com",
  password: "ahmed1234",
  age: 0,
  name: "ahmed",
  tokens:[
    {
    token : jwt.sign({_id: user_id} , process.env.jwtSecret ),
    }
  ]
}

const user_id_two = new mongoose.Types.ObjectId();
const userTwo= {
  _id : user_id_two,
  email: "ahmded@gmail.com",
  password: "ahmed1234",
  age: 0,
  name: "ahmed",
  tokens:[
    {
    token : jwt.sign({_id: user_id_two} , process.env.jwtSecret ),
    }
  ]
}


const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description:"task one",
  owner:user_id,
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description:"task two",
  owner:user_id,
}
const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description:"task three",
  owner:user_id_two,
}

async function setupMongo () {
    await users.deleteMany();
    await tasks.deleteMany();
    await new users(userOne).save() ;
    await new users(userTwo).save() ;
    await new tasks(taskOne).save();
    await new tasks(taskTwo).save();
    await new tasks(taskThree).save();
}

module.exports = {
  userOne,
  user_id,
  setupMongo,
   userTwo,
  taskOne
}