import {check} from 'meteor/check';
import {type DocumentDocument, Documents} from '../../collection/documents';
import type Options from '../../Options';
import define from '../define';

export default define({
	name: 'patient.documents',
	cursor(patientId: string, options: Options<DocumentDocument>) {
		check(patientId, String);
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
