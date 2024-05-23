import {type FileRef} from 'meteor/ostrio:files';

import {randomPNGBuffer, randomPNGDataURI} from '../../../_test/png';
import {type MetadataType, Uploads} from '../../uploads';

export const newUpload = async (
	invocation?: {userId?: string},
	options?: {name?: string},
): Promise<FileRef<MetadataType>> => {
	const type = 'image/png';
	const fileName = options?.name ?? 'pic.png';
	if (Meteor.isServer) {
		const buffer = await randomPNGBuffer();
		return Uploads.write(
			buffer,
			{
				fileName,
				type,
				userId: invocation?.userId,
			},
			true,
		);
	}

	return new Promise((resolve, reject) => {
		Uploads.insert({
			file: randomPNGDataURI(),
			isBase64: true,
			fileName,
			chunkSize: 'dynamic',
			onUploaded(error, fileRef) {
				if (error) {
					reject(error);
				} else {
					resolve(fileRef);
				}
			},
		});
	});
};
