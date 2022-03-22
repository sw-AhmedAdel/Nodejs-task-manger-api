
const tasks = require('./task.mongo');


//get user tasks 

async function getTsaks (user_id) {
  return await tasks.find({owner : user_id});
}

// post
async function createTask(req) {
  
  const newTask = new tasks({
    ...req.body,// copy the all object 
    owner: req.user._id,
  });
  await newTask.save();
  return newTask;
}

//find task
async function findTask(filter) {
   return await tasks.findOne(filter);
}


//// update // i can use it to update the task 
async function updateTask(id , task) {
   const newtask = await tasks.updateOne({
    _id:id
   }, task)

   return newtask.modifiedCount === 1;
   
}


//delete
async function deleteTask(id) {
  const task = await tasks.deleteOne({
    _id:id
  });
  return task.acknowledged===true
}

// delete all tasks 
async function deleteAllTasks(id) {
  const deleteTasks = await tasks.deleteMany({
    owner: id
  })
  return deleteTasks.acknowledged===true && deleteTasks.deletedCount > 0
}
module.exports= {
  createTask,
  getTsaks,
  findTask,
  deleteTask,
  deleteAllTasks
}