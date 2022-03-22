const express = require('express');
const api = express.Router();
const userRoutes = require('./users/user.routes');
const taskRoter = require('./tasks/task.routes');
const weatherRoute = require('./weather/weather.routes');

api.use('/users' , userRoutes);
api.use('/tasks',taskRoter);
api.use('/weather' , weatherRoute);
module.exports= api;