import {Uploads} from './uploads';

export const newUpload = async (invocation) => {
	const type = 'image/png';
	const fileName = 'pic.png';
	const base64Encoded =
		'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
	if (Meteor.isServer) {
		const {Buffer} = await import('buffer');
		return new Promise((resolve, reject) => {
			Uploads.write(
				Buffer.from(base64Encoded, 'base64'),
				{
					fileName,
					type,
					userId: invocation.userId,
				},
				(writeError, fileRef) => {
					if (writeError) {
						reject(writeError);
					} else {
						resolve(fileRef);
					}
				},
				true,
			);
		});
	}

	return new Promise((resolve, reject) => {
		const upload = Uploads.insert(
			{
				file: `data:image/png;base64,${base64Encoded}`,
				isBase64: true,
				fileName,
				chunkSize: 'dynamic',
			},
			false,
		);

		upload.on('end', (err, fileObject) => {
			if (err) {
				reject(err);
			} else {
				resolve(fileObject);
			}
		});

		upload.start();
	});
};

export {Uploads} from './uploads';
