import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Documents} from '../../collection/documents';

import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';

export default define({
	name: 'documents.unlink',
	authentication: AuthenticationLoggedIn,
	validate(documentId: string) {
		check(documentId, String);
	},
	transaction: unconditionallyUpdateById(Documents, {$unset: {patientId: ''}}),
});
