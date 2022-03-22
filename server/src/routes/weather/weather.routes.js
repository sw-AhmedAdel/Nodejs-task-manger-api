const express = require('express');
const weatherRoute = express.Router();

const {getWeahter} = require('./weather.controller');
weatherRoute.get('/address' ,getWeahter )

module.exports= weatherRoute