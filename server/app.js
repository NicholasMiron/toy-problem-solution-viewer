const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// const db = require('../db/index.js');

const app = express();

app.use(morgan('combined', { stream: fs.createWriteStream(path.join(__dirname, '../coverage/access.log'), { flags: 'a' }) }));
app.use(cors());

app.use(express.static('dist'));


module.exports = app;
