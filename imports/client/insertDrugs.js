import {Meteor} from 'meteor/meteor';

import Papa from 'papaparse';

export default function insertDrugs(fd) {
	let i = 0;
	Papa.parse(fd, {
		header: true,
		dynamicTyping: true,
		chunk: Meteor.bindEnvironment((results, _parser) => {
			Meteor.call('drugs.insertMany', results.data);
			i += results.data.length;
		}),
		complete: () => {
			console.log(i);
		},
	});
}
