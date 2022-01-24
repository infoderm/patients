import createPromise from '../../util/createPromise';
import call from '../endpoint/call';
import insert from '../endpoint/documents/insert';

export default async function insertDocument(history, format, fd) {
	console.debug('insert-document', format, fd);

	const {promise, resolve, reject} = createPromise();

	const reader = new FileReader();

	reader.addEventListener('load', async (event) => {
		const buffer = event.target.result as ArrayBuffer;
		const array = new Uint8Array(buffer);
		const op = {
			format,
			array,
		};
		try {
			const result = await call(insert, op);
			console.debug('Inserted/updated', result.length, 'documents.');
			if (history && history.location.pathname !== '/documents') {
				history.push({pathname: '/documents'});
			}

			resolve(result);
		} catch (error: unknown) {
			console.error({error});
			reject(error);
		}
	});

	reader.readAsArrayBuffer(fd);

	return promise;
}
