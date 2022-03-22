
const {createTask,
      getTsaks,
      findTask,
      deleteTask,
      deleteAllTasks,
      } = require('../../models/task.models');

const {getPagination} = require('../../services/services.functions');

// get my tasks 
async function httpGtTsaks (req , res) {
  //i could have used getTsaks function to get the all tasks that related to the user
  //const tasks = await getTsaks(req.user._id);
 //use this to test in postman >>>> {{url}}/v1/tasks?sortBy=createdAt:asc&completed=true&limit=2&page=1
 const {limit , skip} = getPagination(req.query)
 const match={};
 const sort={};

 if(req.query.completed){
  match.completed= req.query.completed === 'true' ? true : false
 }

 if(req.query.sortBy) {
  const parts = req.query.sortBy.split(':');
  sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
 }
 try{
  await req.user.populate({
    path:'tasks',
    match,
    options:{
      limit,
      skip,
      sort,
    },
   
  })
  return res.status(200).json(req.user.tasks);
}catch(e){
  return res.status(400).json({
    error:'error happend'
  })
}
}

// get task by id
async function httpGetTaskById (req , res) {
 const id = req.params.id;
 const filter= {
   _id : id,
   owner:req.user._id,
 }
 const task = await findTask (filter);
 if(!task){
   return res.status(400).json({
     error:"can not get this data",
   })
 }
 return res.status(200).json(task);
}
////post
async function httpcreateTask(req , res) {

  if(!req.body.description) {
    return res.status(400).json({
      error:"please write the task name",
    })
  }

  const newTask=  await createTask(req);
  return res.status(201).json(newTask);
}

//update 

async function httpupdateTask(req , res) {
   const task = req.body;
   const updates =Object.keys(task);
   const id = req.params.id;
   const allowedUpdates = ['description', 'completed'];
   const isallowedOperation = updates.every((update) => allowedUpdates.includes(update));

   if(!isallowedOperation) {
    return res.status(400).json({
      error:"invalid updates"
    })
   }
   if(task.completed) {
     if(task.completed !== true && task.completed !==false)
     return res.status(400).json({
       error:"please enter true or false"
     })
   }

   const filter = {
     _id : id,
     owner:req.user._id
   }
   const isexits = await findTask(filter);
   if(!isexits) {
    return res.status(400).json({
      error:"task is not exits"
    })
   }
   updates.forEach((update)=> isexits[update] = task[update]);
   await isexits.save();
   return res.status(200).json(isexits)
}


//delete
async function httpdeleteTask(req , res) {
   const id =  req.params.id;

   const filter = {
     _id : id,
     owner:req.user._id
   }
   const isexits = await findTask(filter);

   if(!isexits){
    return res.status(400).json({
      error:"task is not exits"
    })
   }
   
   const task = await deleteTask(id);
   if(!task){
     return res.status(400).json({
       error:"can not delete the task"
     })
   }
   
   return res.status(200).json(isexits);
   // or use await isexits.remove(); to delete task 
}

// delete all tasks
async function httpdeleteAllTask (req , res) {

  const id = req.user._id ;
  const deleteAll = await deleteAllTasks(id);
  if(!deleteAll) {
    return res.status(400).json({
      error:"you do not have any tasks"
    })
  }
  return res.status(200).json({
    ok:true,
  })
}
module.exports = {
  httpcreateTask,
  httpGtTsaks,
  httpupdateTask,
  httpdeleteTask,
  httpGetTaskById,
  httpdeleteAllTask
}