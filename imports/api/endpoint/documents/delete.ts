import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Documents} from '../../collection/documents';
import {documents} from '../../documents';
import type TransactionDriver from '../../transaction/TransactionDriver';

import define from '../define';
import EndpointError from '../EndpointError';

const {updateLastVersionFlags} = documents;

export default define({
	name: 'documents.delete',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	async transaction(db: TransactionDriver, documentId) {
		const document = await db.findOne(Documents, {
			_id: documentId,
			owner: this.userId,
		});
		if (document === null) {
			throw new EndpointError('not-found');
		}

		await db.updateOne(Documents, {_id: documentId}, {$set: {deleted: true}});
		await updateLastVersionFlags(db, this.userId, document);
		return undefined;
	},
});
