import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {
	type DocumentDocument,
	Documents,
	documentDocument,
} from '../../collection/documents';
import {options} from '../../query/Options';
import type Options from '../../query/Options';
import define from '../define';

export default define({
	name: 'patient.documents',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), options(documentDocument)]),
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
