import {check} from 'meteor/check';
import {Documents} from '../../../collection/documents';
import define from '../../define';

export default define({
	name: 'patient.documents.all',
	cursor(patientId: string, options) {
		check(patientId, String);
		return Documents.find(
			{
				owner: this.userId,
				patientId,
			},
			options,
		);
	},
});
