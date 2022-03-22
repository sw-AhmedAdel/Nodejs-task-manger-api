const express = require('express');
const app = express();
const api = require('../src/routes/api');

app.use(express.json());
app.use('/v1',api);


module.exports = app;