import assert from 'assert';
// @ts-expect-error Needs more recent @types/node
import {type Buffer} from 'buffer';
import promisify from './async/promisify';
import schema from './schema';

const SUPPORTED_HASH_ALGO = 'sha256' as const;
const SUPPORTED_KEY_ENCODING = 'base64' as const;
const SUPPORTED_INPUT_ENCODING = 'utf8' as const;
const SUPPORTED_DOCUMENT_ENCODING = 'json' as const;
const SUPPORTED_SIGNATURE_ENCODING = 'base64' as const;

export const hmacConfig = schema
	.object({
		hashAlgo: schema.literal(SUPPORTED_HASH_ALGO),
		keyEncoding: schema.literal(SUPPORTED_KEY_ENCODING),
		inputEncoding: schema.literal(SUPPORTED_INPUT_ENCODING),
		documentEncoding: schema.literal(SUPPORTED_DOCUMENT_ENCODING),
		signatureEncoding: schema.literal(SUPPORTED_SIGNATURE_ENCODING),
	})
	.strict();

export type HMACConfig = schema.infer<typeof hmacConfig>;

export const document = schema.object({
	hmac: hmacConfig,
});

export type Document = schema.infer<typeof document>;

type Key = string;
type Signature = string;

export type SignedDocument = {
	signature: Signature;
} & Document;

const encodeDocument = (encoding: string, document: Document) => {
	switch (encoding) {
		case 'json': {
			// TODO Careful here, we may need to follow a canonical order
			// see https://stackoverflow.com/questions/5046835/mongodb-field-order-and-document-position-change-after-update/6453755#6453755
			return JSON.stringify(document);
		}

		default: {
			throw new Error(`unknown encoding ${encoding}`);
		}
	}
};

export const extractSignature = <T>(
	signedDocument: T extends SignedDocument ? T : never,
): {document: Omit<T, 'signature'>; signature: Signature} => {
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
	// const generate = promisify<unknown>(generateKey);
	// const type = 'hmac';
	// const length = bytes * 8;
	// const keyObject = await generate(type, {length});
	// return keyObject.export().toString(hmac.keyEncoding);
	const {randomBytes} = await crypto();
	const generate = promisify(randomBytes);
	const buffer = await generate(bytes);
	return buffer.toString(hmac.keyEncoding);
};
