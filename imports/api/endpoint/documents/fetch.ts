import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Documents} from '../../collection/documents';

import define from '../define';
import EndpointError from '../EndpointError';

export default define({
	name: 'documents.fetch',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
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
			throw new EndpointError('not-found');
		}

		return document.decoded ?? document.source;
	},
});
