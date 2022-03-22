
const {createUser,
      findUser,
      findByCredentials
    } = require('../../models/user.models');

const {
  checkEmail,
  checkpasswodLength,
  checkpasswodWords,
} =require('../../services/services.functions');

const {sendWelcomeEmail,
      sendCancelationEmail ,
} = require('../../emails/account');

///get My profile
 async function httpGetMyProfile(req , res) {
  const user = req.user;
  return res.status(200).json(user);
}


//// update
async function httpupdateUSer(req , res) {

    try{
    const user = req.body;
    const updates = Object.keys(user);//take the keys from the object 
    const allowedUpdates =['name','age','password','email'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    
    if(!isValidOperation){
      return res.status(400).json({
        error:"invalid updates"
      })
    }

    if(user.email) {
      if(!checkEmail(user.email)){
      return res.status(400).json({
        error:"invalied email",
      })
    }
  }
    if(user.password){
      if(checkpasswodLength(user.password)){
      return res.status(400).json({
        error:"password length must be 6 chars or greater",
      })
      }
      if(checkpasswodWords(user.password)){
        return res.status(400).json({
          error:"password must not contains password word",
        })
      }
    }
  
  updates.forEach((update) => req.user[update] = user[update]);
  await req.user.save();
  return res.status(200).json(req.user);
    }
    catch(e){
      return res.status(400).json({
        error:"could not update"
      })
    }
  
}


// delete
async function httpdeleteUser(req , res) {

  try{
  await req.user.remove(); 
  sendCancelationEmail(req.user.email , req.user.name);
  return res.status(200).json(req.user);
  }
  catch(e){
    return res.status(401).json({
      error:"could not delete your account"
    })
  }
}


/////////////////post  user
async function httpcreateUser(req , res) {
  const user = req.body;
  if(!user.name || !user.email || !user.password ) {
    return res.status(400).json({
      error:"missing data",
    })
  }
   
  if(!checkEmail(user.email)){
    return res.status(400).json({
      error:"invalied email",
    })
  }
  if(checkpasswodLength(user.password)){
    return res.status(400).json({
      error:"password length must be 6 chars or greater",
    })
  }

  if(checkpasswodWords(user.password)){
    return res.status(400).json({
      error:"password must not contains password word",
    })
  }
  const email = {
    email : user.email
  }
  const dublicatedEmail = await findUser(email);
  if(dublicatedEmail){
    return res.status(400).json({
      error:"this email is exits",
    })
  }
  
  const newUser= await createUser(user);
  sendWelcomeEmail(newUser.email , newUser.name);
  const token = await newUser.generateAuthTokens();
  return res.status(201).json({
    newUser ,
    token})
}


///// login 
async function httpLoginUser (req , res) {
   const user = await findByCredentials(req.body.email , req.body.password);
   if(!user){
     return res.status(400).json({
       error:"unable to login",
     })
   }
  
   const token = await user.generateAuthTokens();

   return res.status(200).json({
     user,
     token
   });
}

// logout from 1 session
async function httpLogOut (req , res) {
  try{
   
    req.user.tokens = req.user.tokens.filter((token) =>  req.token !== token.token);
    await req.user.save();
    return res.status(200).json({
      logout:true
    })
  }catch(e) {
    return res.status(400).json({
      error:"colud not log out, please try again",
    })
  }
}

/// logoutAll
async function httpLogOutAll (req , res) {
  try {
   req.user.tokens=[];
   req.token='';
   await req.user.save();
   return res.status(200).json({
     logoutall:true,
   })

  }
  catch(e) {
    return res.status(400).json({
      error:"colud not log out, please try again",
    })
  }
}

// profle pic

async function httpGetProfilePic(req , res) {
  const id = req.params.id;
  const user = await findUser({_id : id});
  if(!user) {
    return res.status(400).json({
      error:'user is not found'
    })
  }
  if(!user.avatar) {
    return res.status(400).json({
      error:'user does not have avatar'
    })
  }

   res.set('Content-Type' , 'image/png');
   return res.status(200).send(user.avatar);
}





module.exports = {
  httpcreateUser,
  httpupdateUSer,
  httpdeleteUser,
  httpLoginUser,
  httpGetMyProfile,
  httpLogOut,
  httpLogOutAll,  
  httpGetProfilePic
}

