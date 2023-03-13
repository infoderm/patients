import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {type DocumentDocument, Documents} from '../../collection/documents';
import type Options from '../../Options';
import define from '../define';

export default define({
	name: 'patient.documents',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([
		schema.string(),
		schema.object({
			/* TODO */
		}),
	]),
	cursor(patientId: string, options: Options<DocumentDocument>) {
		return Documents.find(
			{
				owner: this.userId,
				patientId,
				lastVersion: true,
				deleted: false,
			},
			options,
		);
	},
});
