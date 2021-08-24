module.exports = {
	servers: {
		one: {
			host: 'dermatodoc.local',
			username: 'meteorapp',
			pem: '~/.ssh/meteorapp',
		},
	},

	meteor: {
		name: 'patients',
		path: '../../',
		servers: {
			one: {},
		},
		docker: {
			image: 'zodern/meteor:latest',
			prepareBundle: true,
			useBuildKit: true,
		},
		buildOptions: {
			serverOnly: true,
		},
		env: {
			ROOT_URL: 'https://dermatodoc.local',
			PORT: 3001,
		},
		deployCheckWaitTime: 30,
		deployCheckPort: 443,
		enableUploadProgressBar: true,
	},

	mongo: {
		version: '4.4',
		oplog: true,
		port: 27017,
		servers: {
			one: {},
		},
	},
};
