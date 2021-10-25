import {check} from 'meteor/check';

import {Documents} from '../../collection/documents';

import define from '../define';

export default define({
	name: 'documents.fetch',
	validate(documentId: string) {
		check(documentId, String);
	},
	run(documentId: String) {
		const document = Documents.findOne(
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
