const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;

// Get uri from Atlas and use password in .env
const uri = '';
mongoose.connect(uri, { useNewUrlParser: true });

const dbSchema = mongoose.Schema({
  name: 'String',
  age: 'Number',
});

const People = mongoose.model('People', dbSchema);

const addNewPerson = (name, age) => {
  const newPerson = new People({ name, age });
  newPerson.save();
};

const getPerson = name => People.findOne({ name });

module.exports = { addNewPerson, getPerson };
