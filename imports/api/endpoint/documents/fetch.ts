import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Documents} from '../../collection/documents';

import define from '../define';

export default define({
	name: 'documents.fetch',
	authentication: AuthenticationLoggedIn,
	validate(documentId: string) {
		check(documentId, String);
	},
	async run(documentId: string) {
		const document = await Documents.findOneAsync(
			{
				_id: documentId,
				owner: this.userId,
			},
			{
				fields: {
					decoded: 1,
					source: 1,
				},
			},
		);
		if (!document) {
			throw new Meteor.Error('not-found');
		}

		return document.decoded ?? document.source;
	},
});
