import {check} from 'meteor/check';

import {Documents} from '../../collection/documents';
import {documents} from '../../documents';

import define from '../define';

const {updateLastVersionFlags} = documents;

export default define({
	name: 'documents.superdelete',
	validate(documentId: string) {
		check(documentId, String);
	},
	run(documentId: String) {
		// TODO make atomic
		const document = Documents.findOne(documentId);
		if (!document || document.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Documents.remove(documentId);
		updateLastVersionFlags(this.userId, document);
	},
});
