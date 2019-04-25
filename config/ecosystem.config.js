module.exports = {
  apps: [{
    name: 'myapp',
    script: '../server/index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: '<your host here don\'t include http://>',
      key: '~/.ssh/<yourKeyHere.pem>',
      ref: 'origin/master',
      repo: '<your github repo here use the ssh link>',
      path: '/home/ubuntu/myapp',
      'post-deploy': 'npm install && npm run build-one && pm2 startOrRestart ecosystem.config.js'
    }
  }
}