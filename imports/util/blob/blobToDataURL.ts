const _blobToDataURLClient = async (blob: Blob): Promise<string> =>
	new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener('load', (_e) => {
			resolve(reader.result as string);
		});

		reader.addEventListener('error', (_e) => {
			reject(reader.error);
		});

		reader.addEventListener('abort', (_e) => {
			reject(new Error('Read aborted'));
		});
		reader.readAsDataURL(blob);
	});

const _blobToDataURLServer = async (blob: Blob): Promise<string> => {
	const mimeType = blob.type;
	if (mimeType === '') {
		throw new Error('unknown mime-type');
	}

	const arrayBuffer = await blob.arrayBuffer();

	const {Buffer} = await import('buffer');
	const buffer = Buffer.from(arrayBuffer);

	const base64 = buffer.toString('base64');

	const {default: dataURL} = await import('../dataURL');
	return dataURL(mimeType, base64);
};

const blobToDataURL = Meteor.isServer
	? _blobToDataURLServer
	: _blobToDataURLClient;

export default blobToDataURL;
