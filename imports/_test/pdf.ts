import blobToDataURL from '../util/blob/blobToDataURL';

const document = `%PDF-1.0
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj
xref
0 4
0000000000 65535 f
0000000009 00000 n
0000000052 00000 n
0000000101 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
147
%EOF
`;

export const randomPDFUint8Array = (): Uint8Array => {
	return new TextEncoder().encode(document);
};

export const randomPDFBuffer = async () => {
	const {Buffer} = await import('buffer');
	const array = randomPDFUint8Array();
	return Buffer.from(array);
};

export const randomPDFBlob = (): Blob => {
	const data = randomPDFUint8Array();
	return new Blob([data.buffer], {type: 'application/pdf'});
};

export const randomPDFDataURI = async (): Promise<string> => {
	const blob = randomPDFBlob();
	return blobToDataURL(blob);
};
