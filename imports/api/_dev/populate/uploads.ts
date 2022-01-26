import {FileRef} from 'meteor/ostrio:files';
import {randomPNGBuffer, randomPNGDataURI} from '../../../test/png';
import {MetadataType, Uploads} from '../../uploads';

export const newUpload = async (invocation): Promise<FileRef<MetadataType>> => {
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
		Uploads.insert({
			file: randomPNGDataURI(),
			isBase64: true,
			fileName,
			chunkSize: 'dynamic',
			onUploaded: (error, fileRef) => {
				if (error) {
					reject(error);
				} else {
					resolve(fileRef);
				}
			},
		});
	});
};
