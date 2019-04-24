const path = require('path');

module.exports = {
  rootDir: path.join(`${__dirname}/..`),
  testEnvironment: 'node',
  verbose: true,
  bail: 1,
};
