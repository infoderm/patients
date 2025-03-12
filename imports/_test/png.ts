import pngDataURL from '../util/png/dataURL';

const base64Encoded =
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const randomPNGBase64 = () => base64Encoded;

export const randomPNGBuffer = async () => {
	const {Buffer} = await import('buffer');
	return Buffer.from(base64Encoded, 'base64');
};

export const randomPNGDataURI = (): string => pngDataURL(base64Encoded);

export const randomPNGResponse = async (): Promise<Response> =>
	fetch(randomPNGDataURI());

export const randomPNGArrayBuffer = async (): Promise<ArrayBuffer> => {
	const response = await randomPNGResponse();
	return response.arrayBuffer();
};

export const randomPNGBlob = async (): Promise<Blob> => {
	const response = await randomPNGResponse();
	return response.blob();
};
