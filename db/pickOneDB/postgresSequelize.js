const Sequelize = require('sequelize');
require('dotenv').config();

// Add username and password into .env change database name
const sequelize = new Sequelize('databaseName', process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  define: {
    timestamps: true,
  },
  logging: true,
});

sequelize.authenticate()
  .then(() => console.log('Succsfully connected to DB'))
  .catch(err => console.log('Failed to connect to DB:', err));

const Products = sequelize.define('carouselproducts', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

const getPerson = name => Products.findAll({ where: { name } });

module.exports = { getPerson };
