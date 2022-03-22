const express = require('express');
const taskRoter = express.Router();

const {httpcreateTask ,
      httpGtTsaks,
      httpupdateTask,
      httpdeleteTask,
      httpGetTaskById,
      httpdeleteAllTask} = require('./task.controller');
const auth = require('../../middleware/auth');

taskRoter.get('/',auth,httpGtTsaks)
taskRoter.get('/:id', auth , httpGetTaskById);
taskRoter.post('/', auth , httpcreateTask);
taskRoter.put('/:id', auth, httpupdateTask);
taskRoter.delete('/:id', auth,httpdeleteTask);
taskRoter.delete('/',auth , httpdeleteAllTask)

module.exports =taskRoter;