import Papa from 'papaparse';
import call from '../endpoint/call';
import insertMany from '../endpoint/drugs/insertMany';

export default function insertDrugs(fd) {
	let i = 0;
	Papa.parse(fd, {
		header: true,
		dynamicTyping: true,
		chunk: async (results, _parser) => {
			await call(insertMany, results.data);
			i += results.data.length;
		},
		complete: () => {
			console.log(i);
		},
	});
}
