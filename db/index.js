const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;

// Get uri from Atlas and use password in .env
// const uri = `mongodb+srv://nicholasmiron:${process.env.MONGO_DB_PASSWORD}`;
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


module.exports = { addNewPerson };
