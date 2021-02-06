module.exports = {
	servers: {
		one: {
			host: 'dermatodoc.local',
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
			image: 'abernix/meteord:node-12.20.0-base'
		},
		buildOptions: {
			serverOnly: true
		},
		env: {
			ROOT_URL: 'https://dermatodoc.local'
		},
		deployCheckWaitTime: 30,
		enableUploadProgressBar: true
	},

	mongo: {
		version: '3.6',
		oplog: true,
		port: 27017,
		servers: {
			one: {}
		}
	}
};
