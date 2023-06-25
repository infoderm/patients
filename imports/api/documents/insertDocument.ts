import assert from 'assert';

import {type useNavigate} from 'react-router-dom';

import createPromise from '../../lib/async/createPromise';
import call from '../endpoint/call';
import insert from '../endpoint/documents/insert';

type Format = undefined | string;

export default async function insertDocument(
	navigate: ReturnType<typeof useNavigate>,
	format: Format,
	fd: File,
) {
	console.debug('insert-document', format, fd);

	const {promise, resolve, reject} = createPromise();

	const reader = new FileReader();

	reader.addEventListener('load', async ({target}) => {
		assert(target !== null);
		const buffer = target.result as ArrayBuffer;
		const array = new Uint8Array(buffer);
		const op = {
			format,
			array,
		};
		try {
			const result = await call(insert, op);
			console.debug('Inserted/updated', result.length, 'documents.');
			navigate('/documents');
			resolve(result);
		} catch (error: unknown) {
			console.error({error});
			reject(error);
		}
	});

	reader.readAsArrayBuffer(fd);

	return promise;
}
