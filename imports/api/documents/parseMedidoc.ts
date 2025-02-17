import omit from 'lodash.omit';
import {list} from '@iterable-iterator/list';
import {zip} from '@iterable-iterator/zip';
import {filter} from '@iterable-iterator/filter';
import {map} from '@iterable-iterator/map';
import {sum} from '@iterable-iterator/reduce';
import {isEmpty} from '@iterable-iterator/cardinality';
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
	const {type, results} = document;
	const identifier =
		type === 'lab'
			? document.lab.name
			: `${document.doctor.lastname} ${document.doctor.firstname}`;

	const sections = list(filter(({type}) => type === 'b', results));
	const labResults = list(
		filter(
			({type, comments}) =>
				(type !== 'b' && type !== 'c') || (type === 'c' && !isEmpty(comments)),
			results,
		),
	);
	const kind =
		type === 'lab'
			? isEmpty(results) || !isEmpty(labResults)
				? 'lab'
				: 'report'
			: type;

	if (kind === 'lab') throw new Error('Medidoc lab reports not implemented');

	const anomalies = sum(
		map(({intensity}) => (intensity === 'Normal' ? 0 : 1), labResults),
	);

	return {
		kind,
		anomalies,
		identifier,
		datetime: medidocParseDatetime(document.meta),
		reference: document.meta.reference,
		status: document.meta.status,
		sections,
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
			...omit(document, ['lines', 'results']),
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
