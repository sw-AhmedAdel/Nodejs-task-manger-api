const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const tasks = require('./task.mongo');
require('dotenv').config();
const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true,
    lowercase :true,
  },
  email :{
  type: String,
  required:true,
  trim:true,
  lowercase :true,
  },
  password: {
  type :String,
  trim:true,
  require:true,

  },
  age:{
    type:Number, 
    default:0,

  },
   
  avatar : {
    type:Buffer
  }
  ,
  tokens:[{//this is array of tokens that has object , each object is a token
    token: {
      type:String,
      required:true,
    }
  }]
}, {
  timestamps: true
})


userSchema.virtual('tasks' , {
  ref:'task',//name the task model
  localField:'_id',
  foreignField:'owner',
})

//hide tokens and password
userSchema.methods.toJSON = function () {
  const user =this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
}


//make jwt token for each user
const jwtSecret= process.env.jwtSecret
userSchema.methods.generateAuthTokens = async function() {
  const user = this;
  const token = jwt.sign({_id:user._id.toString()} ,jwtSecret , {expiresIn : '7 days'});
  //user.tokens = user.tokens.concat({token});
  user.tokens.push({token})
  await user.save();//save token in the data
  return token;
 
}

//compare password

 userSchema.statics.findByCredentials  = async  function(email , password)  {
   const user = await users.findOne({
     email
   })
   if(!user) {
     return false;
   }
   const ismatch = await bcrypt.compare(password , user.password);
   if(!ismatch) {
   return false;
   }
   return user;
 }

// hash password
userSchema.pre('save', async function (next)
{
  const user = this;
  if(user.isModified ('password')) {
    user.password = await bcrypt.hash(user.password , 8);
  }
  next();
})

//remove tasks when user is removed 
userSchema.pre('remove' , async function(next) {
  const user =this;
  await tasks.deleteMany({owner : user._id })
  next();
})
const users= mongoose.model('user' , userSchema);
module.exports  = users ;





