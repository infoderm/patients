import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Documents} from '../../collection/documents';

import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';

export default define({
	name: 'documents.unlink',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	transaction: unconditionallyUpdateById(Documents, {$unset: {patientId: ''}}),
});
