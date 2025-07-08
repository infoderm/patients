import {type FileObj} from 'meteor/ostrio:files';

import {randomPNGBuffer, randomPNGDataURI} from '../../../_test/png';
import {randomPDFBuffer, randomPDFDataURI} from '../../../_test/pdf';
import {type MetadataType, Uploads} from '../../uploads';

type Options = {
	name?: string;
	type?: 'image/png' | 'application/pdf';
};

export const newUpload = async (
	invocation?: {userId?: string},
	options: Options = {},
): Promise<FileObj<MetadataType>> => {
	const {type = 'image/png'} = options;
	const name =
		options?.name ?? (type === 'application/pdf' ? 'file.pdf' : 'pic.png');
	if (Meteor.isServer) {
		const buffer =
			type === 'application/pdf'
				? await randomPDFBuffer()
				: await randomPNGBuffer();
		return Uploads.writeAsync(
			buffer,
			{
				name,
				type,
				userId: invocation?.userId,
			},
			true,
		);
	}

	const file =
		type === 'application/pdf' ? await randomPDFDataURI() : randomPNGDataURI();

	return new Promise((resolve, reject) => {
		Uploads.insert({
			file,
			isBase64: true,
			fileName: name,
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
