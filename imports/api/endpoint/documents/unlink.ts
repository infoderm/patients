import {check} from 'meteor/check';

import {Documents} from '../../collection/documents';

import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';

export default define({
	name: 'documents.unlink',
	validate(documentId: string) {
		check(documentId, String);
	},
	transaction: unconditionallyUpdateById(Documents, {$unset: {patientId: ''}}),
});
