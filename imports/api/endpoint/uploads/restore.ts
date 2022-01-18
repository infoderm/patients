import {check} from 'meteor/check';

import {Uploads} from '../../uploads';
import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';

export default define({
	name: 'uploads.restore',
	validate(uploadId: string) {
		check(uploadId, String);
	},
	transaction: unconditionallyUpdateById(
		Uploads.collection,
		{
			$set: {'meta.isDeleted': false},
		},
		'userId',
	),
});
