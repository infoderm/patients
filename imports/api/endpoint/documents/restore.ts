import {check} from 'meteor/check';

import {Documents} from '../../collection/documents';
import {documents} from '../../documents';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';

const {updateLastVersionFlags} = documents;

export default define({
	name: 'documents.restore',
	validate(documentId: string) {
		check(documentId, String);
	},
	async transaction(db: TransactionDriver, documentId: string) {
		const document = await db.findOne(Documents, {
			_id: documentId,
			owner: this.userId,
		});
		if (document === null) {
			throw new Meteor.Error('not-found');
		}

		await db.updateOne(Documents, {_id: documentId}, {$set: {deleted: false}});
		await updateLastVersionFlags(db, this.userId, document);
		return undefined;
	},
});
