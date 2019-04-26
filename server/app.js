const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// const db = require('../db/index.js');

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.use(express.static('dist'));


module.exports = app;
