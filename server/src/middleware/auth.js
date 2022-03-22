
const jwt = require('jsonwebtoken');
const users = require('../models/users.mongo');
require('dotenv').config();
const jwtSecret= process.env.jwtSecret

async function auth (req , res, next) {
  try{
  const token = req.header('Authorization').replace('Bearer ', '');
  const decoded = jwt.verify(token , jwtSecret);
  const user = await users.findOne({_id : decoded._id ,'tokens.token': token});
  
  if(!user) {
    throw new Error();
  }
  req.token = token;
  req.user = user;
 
  next();
  }
  catch(e) {
    return res.status(401).json({
      error:"please authenticate"
        })
  }
}

module.exports = auth;




















