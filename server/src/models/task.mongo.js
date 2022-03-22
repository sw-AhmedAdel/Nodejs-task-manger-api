const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description : {
    type:String,
    trim:true,
    required:true,
  },
  completed: {
    type:Boolean,
    default:false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'user'
  }
}, {
  timestamps: true
})

// just in case if i need to check or change the task
taskSchema.pre('save' , async function(next) {
  next();
})



module.exports = mongoose.model('task' , taskSchema);




