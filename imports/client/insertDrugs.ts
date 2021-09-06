import Papa from 'papaparse';
import call from '../api/endpoint/call';
import insertMany from '../api/endpoint/drugs/insertMany';

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
