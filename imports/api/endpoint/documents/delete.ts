import {check} from 'meteor/check';

import {Documents} from '../../collection/documents';
import {documents} from '../../documents';

import define from '../define';

const {updateLastVersionFlags} = documents;

export default define({
	name: 'documents.delete',
	validate(documentId: string) {
		check(documentId, String);
	},
	run(documentId: string) {
		// TODO make atomic
		const document = Documents.findOne({_id: documentId, owner: this.userId});
		if (!document) {
			throw new Meteor.Error('not-found');
		}

		Documents.update(documentId, {$set: {deleted: true}});
		updateLastVersionFlags(this.userId, document);
	},
});
