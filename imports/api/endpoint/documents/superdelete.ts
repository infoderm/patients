import {check} from 'meteor/check';

import {Documents} from '../../collection/documents';
import {documents} from '../../documents';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';

const {updateLastVersionFlags} = documents;

export default define({
	name: 'documents.superdelete',
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

		await db.deleteOne(Documents, {_id: documentId});
		await updateLastVersionFlags(db, this.userId, document);
		return undefined;
	},
});
