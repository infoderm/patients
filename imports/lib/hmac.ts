import assert from 'assert';
import promisify from '../util/promisify';

type SUPPORTED_HASH_ALGOS = 'sha256';
type SUPPORTED_KEY_ENCODING = 'base64';
type SUPPORTED_INPUT_ENCODING = 'utf8';
type SUPPORTED_DOCUMENT_ENCODING = 'json';
type SUPPORTED_SIGNATURE_ENCODING = 'base64';

export interface HMACConfig {
	hashAlgo: SUPPORTED_HASH_ALGOS;
	keyEncoding: SUPPORTED_KEY_ENCODING;
	inputEncoding: SUPPORTED_INPUT_ENCODING;
	documentEncoding: SUPPORTED_DOCUMENT_ENCODING;
	signatureEncoding: SUPPORTED_SIGNATURE_ENCODING;
}

interface Document {
	hmac: HMACConfig;
}

type Key = string;
type Signature = string;

export interface SignedDocument extends Document {
	signature: Signature;
}

const encodeDocument = (encoding: string, document: Document) => {
	switch (encoding) {
		case 'json':
			// TODO Careful here, we may need to follow a canonical order
			// see https://stackoverflow.com/questions/5046835/mongodb-field-order-and-document-position-change-after-update/6453755#6453755
			return JSON.stringify(document);
		default:
			throw new Error(`unknown encoding ${encoding}`);
	}
};

export const extractSignature = (
	signedDocument: SignedDocument,
): {document: Document; signature: Signature} => {
	const {signature, ...document} = signedDocument;
	return {document, signature};
};

const crypto = async () => import('crypto');

export const sign = async (
	symmKey: Key,
	document: Document,
): Promise<Signature> => {
	assert((document as any).signature === undefined);
	const {createHmac} = await crypto();
	const {
		hashAlgo,
		keyEncoding,
		documentEncoding,
		inputEncoding,
		signatureEncoding,
	} = document.hmac;
	const hmac = createHmac(hashAlgo, symmKey, {encoding: keyEncoding});
	const encodedDocument = encodeDocument(documentEncoding, document);
	hmac.update(encodedDocument, inputEncoding);
	return hmac.digest(signatureEncoding);
};

export const verify = async (symmKey: Key, signedDocument: SignedDocument) => {
	const {document, signature: expectedSignature} =
		extractSignature(signedDocument);
	const computedSignature = await sign(symmKey, document);
	return computedSignature === expectedSignature;
};

export const genKey = async (bytes: number, hmac: HMACConfig): Promise<Key> => {
	assert(Number.isInteger(bytes) && bytes >= 1 && bytes <= 2 ** 31 - 1);
	// TODO use this once we get to node v15.x
	// const { generateKey } = await crypto();
	// const generate = promisify(generateKey);
	// const type = 'hmac';
	// const length = bytes * 8;
	// const keyObject = await generate(type, {length});
	// return keyObject.export().toString(hmac.keyEncoding);
	const {randomBytes} = await crypto();
	const generate = promisify(randomBytes);
	const buffer = await generate(bytes);
	return buffer.toString(hmac.keyEncoding);
};
