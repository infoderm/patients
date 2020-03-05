module.exports = {
  servers: {
    one: {
      host: 'dermatodoc.be',
      username: 'meteorapp',
      pem: '~/.ssh/meteorapp'
    }
  },

  meteor: {
    name: 'patients',
    path: '.',
    servers: {
      one: {}
    },
    docker: {
      image: 'abernix/meteord:node-12.16.1-base'
    },
    buildOptions: {
      serverOnly: true
    },
    env: {
      ROOT_URL: 'http://localhost',
      PORT: 3001
    },
    deployCheckWaitTime: 30,
    deployCheckPort: 80,
    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.6',
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
