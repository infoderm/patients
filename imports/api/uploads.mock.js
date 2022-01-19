import {randomPNGBuffer, randomPNGDataURI} from '../test/png';
import {Uploads} from './uploads';

export const newUpload = async (invocation) => {
	const type = 'image/png';
	const fileName = 'pic.png';
	if (Meteor.isServer) {
		const buffer = await randomPNGBuffer();
		return new Promise((resolve, reject) => {
			Uploads.write(
				buffer,
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
				file: randomPNGDataURI(),
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
