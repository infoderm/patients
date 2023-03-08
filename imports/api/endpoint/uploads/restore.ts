import {Uploads} from '../../uploads';
import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../lib/schema';

export default define({
	name: 'uploads.restore',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	transaction: unconditionallyUpdateById(
		Uploads.collection,
		{
			$set: {'meta.isDeleted': false},
		},
		'userId',
	),
});
