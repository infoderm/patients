import Papa from 'papaparse';
import createPromise from '../../lib/async/createPromise';
import call from '../endpoint/call';
import insertMany from '../endpoint/drugs/insertMany';

const insertDrugs = async (fd) => {
	let i = 0;

	const {promise, resolve, reject} = createPromise();

	Papa.parse(fd, {
		header: true,
		dynamicTyping: true,
		async chunk(results: {data: unknown[]}, _parser: unknown) {
			await call(insertMany, results.data);
			i += results.data.length;
		},
		error(error: unknown) {
			reject(error);
		},
		complete() {
			console.log(i);
			resolve(i);
		},
	});

	return promise;
};

export default insertDrugs;
