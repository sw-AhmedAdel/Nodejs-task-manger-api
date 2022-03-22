
//'mongodb+srv://task-manger-api:09o1gvB1lFGqKxWw@cluster0.zqi2f.mongodb.net/task-manger?retryWrites=true&w=majority';
//'mongodb://127.0.0.1:27017/task-manger-api';
require('dotenv').config();
const mongoose = require('mongoose');
const MONGO_URL=process.env.MONGO_URL;

mongoose.connection.once('open', () => {
  console.log('mongo is connected');
})

mongoose.connection.on('error' , () => {
  console.log('can not connect with mongo');
})

async function startMongo (){
  await mongoose.connect(MONGO_URL);
}

async function disconnectMongo () {
  await mongoose.disconnect();
}

module.exports = {
  startMongo ,
  disconnectMongo,
}