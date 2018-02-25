module.exports = {
  servers: {
    one: {
      host: 'localhost',
      username: 'meteorapp'
    }
  },

  meteor: {
    name: 'patients',
    path: '.',
    servers: {
      one: {}
    },
    docker: {
      image: 'abernix/meteord:node-8.4.0-base'
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
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
