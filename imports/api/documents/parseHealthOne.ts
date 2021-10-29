// Import { Binary } from 'meteor/mongo';
import omit from 'lodash.omit';
import {zip} from '@iterable-iterator/zip';

const parseHealthOne = async function* (decoded: string, mangled: string) {
	const {default: parse} = await import('healthone/dist/default/parse.js');

	const mangledDocuments = parse(mangled);
	const documents = parse(decoded);
	if (mangledDocuments.length !== documents.length) {
		throw new Error('Number of entries do not match.');
	}

	for (const [document, mangledDocument] of zip(documents, mangledDocuments)) {
		// Const utf8_array = (new TextEncoder()).encode(decoded);
		// const utf8_buffer = utf8_array.buffer;
		// const utf8_binary = Binary(utf8_buffer);
		yield {
			...omit(document, ['lines']),
			source: mangledDocument.lines.join('\n'),
			decoded: document.lines.join('\n'),
			// Binary: utf8_binary,
			parsed: true,
		};
	}
};

export default parseHealthOne;
