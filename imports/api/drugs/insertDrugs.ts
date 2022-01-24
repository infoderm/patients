import Papa from 'papaparse';
import createPromise from '../../util/createPromise';
import call from '../endpoint/call';
import insertMany from '../endpoint/drugs/insertMany';

const insertDrugs = async (fd) => {
	let i = 0;

	const {promise, resolve, reject} = createPromise();

	Papa.parse(fd, {
		header: true,
		dynamicTyping: true,
		chunk: async (results, _parser) => {
			await call(insertMany, results.data);
			i += results.data.length;
		},
		error: (error) => {
			reject(error);
		},
		complete: () => {
			console.log(i);
			resolve(i);
		},
	});

	return promise;
};

export default insertDrugs;
