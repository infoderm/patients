import {check} from 'meteor/check';

import {Documents} from '../../collection/documents';
import {documents} from '../../documents';
import Wrapper from '../../transaction/Wrapper';

import define from '../define';

const {updateLastVersionFlags} = documents;

export default define({
	name: 'documents.delete',
	validate(documentId: string) {
		check(documentId, String);
	},
	async transaction(db: Wrapper, documentId: string) {
		const document = await db.findOne(Documents, {
			_id: documentId,
			owner: this.userId,
		});
		if (document === null) {
			throw new Meteor.Error('not-found');
		}

		await db.updateOne(Documents, {_id: documentId}, {$set: {deleted: true}});
		await updateLastVersionFlags(db, this.userId, document);
	},
});
