A basic boiler plate for React/Express Apps. 

To Launch:
1. npm install
2. npm run build
3. npm run start
4. Go to localhost:3000

To Use A Database:
1. Choose database you want to use
2. Rename file to index.js
3. Move up one level into db folder
3. Delete pickOneDB folder
4. Uninstall mongoose/sequelize whichever isn't used
5. Uncomment const db = require('../db/index.js'); at the top of app.js in the server
6. Create .env file and add matching variables and values


To Deploy:
1. Choose between Docker/EB or pm2
2. If Docker
  a. Remove ecosystem.config.js from config
  b. npm uninstall pm2 --save-dev
  c. npm run docker
  d. eb init
  e. eb create
3. If pm2
  a. Remove Dockerfile from config
  b. Set up ec2 instance
  c. Add deploy keys
  d. npm run pm2-setup
  e. npm run pm2