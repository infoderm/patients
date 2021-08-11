import {Meteor} from 'meteor/meteor';

export default function insertDocument(history, format, fd) {
	console.debug('insert-document', format, fd);
	const reader = new FileReader();
	reader.addEventListener('load', (event) => {
		const buffer = event.target.result as ArrayBuffer;
		const array = new Uint8Array(buffer);
		const op = {
			format,
			array,
		};
		Meteor.call('documents.insert', op, (err, result) => {
			if (err) {
				console.error(err);
			} else {
				console.debug('Inserted/updated', result.length, 'documents.');
				if (history && history.location.pathname !== '/documents') {
					history.push({pathname: '/documents'});
				}
			}
		});
	});

	reader.readAsArrayBuffer(fd);
}
