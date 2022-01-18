import omit from 'lodash.omit';
import {zip} from '@iterable-iterator/zip';
import {asyncIterableToArray} from '@async-iterable-iterator/async-iterable-to-array';

import parse from 'date-fns/parse';
import isValid from 'date-fns/isValid';

function* candidates({
	date,
	time,
}: {
	date?: string;
	time?: string;
}): IterableIterator<Date> {
	if (date !== undefined) {
		if (time !== undefined) {
			yield parse(`${date}${time}`, 'yyyyMMddHHmm', 0);
		}

		yield parse(date, 'yyyyMMdd', 0);
		yield parse(date, 'yyMMdd', 0);
	}
}

const medidocParseDatetime = (datetime): Date | undefined => {
	for (const date of candidates(datetime)) {
		if (isValid(date)) {
			return date;
		}
	}

	return undefined;
};

const computedProps = (document) => {
	return {
		kind: document.type,
		anomalies: 0, // TODO
		identifier: `${document.doctor.lastname} ${document.doctor.firstname}`,
		datetime: medidocParseDatetime(document.meta),
		reference: document.meta.reference,
		status: document.meta.status,
	};
};

const parseMedidoc = async function* (decoded: string, mangled: string) {
	const {default: parse} = await import('medidoc/dist/default/parse.js');

	const mangledDocuments = await asyncIterableToArray(await parse(mangled));
	const documents = await asyncIterableToArray(await parse(decoded));
	if (mangledDocuments.length !== documents.length) {
		throw new Error('Number of entries do not match.');
	}

	for (const [document, mangledDocument] of zip(documents, mangledDocuments)) {
		// Const utf8_array = (new TextEncoder()).encode(decoded);
		// const utf8_buffer = utf8_array.buffer;
		// const utf8_binary = Binary(utf8_buffer);
		yield {
			...omit(document, ['lines']),
			...computedProps(document),
			source: `${mangledDocument.lines
				.map(({contents}) => contents)
				.join('\n')}\n`,
			decoded: `${document.lines.map(({contents}) => contents).join('\n')}\n`,
			// Binary: utf8_binary,
			parsed: true,
		};
	}
};

export default parseMedidoc;
