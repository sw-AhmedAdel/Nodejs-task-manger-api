const users = require('./users.mongo');

//post
async function createUser (user) {
   const createUser =  new users(user);
   await createUser.save()
   return createUser;
}


//find user
async function findUser(filter) {
  return await users.findOne(filter);
}

 // login 
 async function  findByCredentials (email , password) {
   return await  users.findByCredentials(email , password);
 }




module.exports= {
  createUser,
  findUser,
  findByCredentials
}