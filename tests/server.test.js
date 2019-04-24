const request = require('supertest');
const app = require('../server/app.js');

describe('Some scenario of tests below', () => {
  it('Should get a response from the server', (done) => {
    request(app).get('/')
      .then((response) => {
        expect(response.statusCode).toBeDefined();
        done();
      });
  });
});
