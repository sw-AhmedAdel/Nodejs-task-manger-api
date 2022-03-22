const express = require('express');
const userRoutes = express.Router();
const {httpcreateUser,
      httpupdateUSer,
      httpdeleteUser,
      httpLoginUser,
      httpGetMyProfile,
      httpLogOut,
      httpLogOutAll,
      httpGetProfilePic
      } = require('./user.controller')
const sharp = require('sharp');
const auth = require('../../middleware/auth');
const multer = require('multer');


userRoutes.get('/profile' , auth , httpGetMyProfile )
userRoutes.put('/me', auth ,httpupdateUSer);
userRoutes.delete('/me' , auth ,httpdeleteUser);
userRoutes.post('/', httpcreateUser);
userRoutes.post('/login', httpLoginUser);
userRoutes.post('/logout',auth , httpLogOut);
userRoutes.post('/logoutall',auth ,httpLogOutAll);
userRoutes.get('/:id/avatar', auth , httpGetProfilePic);

//upload images
const upload = multer({
 // dest:"avatars", this code if i want to save the images in this destination 
 //so remove it if i want to access to image and save it in the database
  limits: {
    fileSize: 1000000 // = 1 mb
  },
   fileFilter(req , file , cb) {
      //if(!file.originalname.endsWith('.pdf') )//this for pdf
      //if(!file.originalname.match(/\.(doc|docx )$/) //this for files 
     if(!file.originalname.match(/\.(jpg|gpeg|png)$/) ) {
     return cb (new Error('please upload image'));
     }
     cb(undefined , true);
   }
})
userRoutes.post('/my/avatar' , auth , upload.single('avatar') , async (req , res) =>{
//req.user.avatar = req.file.buffer;
const buffer = await sharp(req.file.buffer).resize({width:250 , height:250}).png().toBuffer();
req.user.avatar = buffer
await req.user.save();

  return res.status(200).json({
    ok:'uploaded'
  })
}, (error , req , res , next) => {
  return res.status(400).json({
    error : error.message
  })
})

//delete

userRoutes.delete('/my/avatar' , auth , async (req , res) => {
  if(!req.user.avatar) {
    return res.status(400).json({
      error:"there is no image to delete"
    })
  }
  req.user.avatar=undefined
  await req.user.save(); 
  return res.status(200).json({
    ok:'delete image'
  })
})

module.exports = userRoutes;



