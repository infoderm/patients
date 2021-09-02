import {check} from 'meteor/check';

import {Uploads} from '../../uploads';
import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';

export default define({
	name: 'uploads.updateFilename',
	validate(uploadId: string, filename: string) {
		check(uploadId, String);
		check(filename, String);
	},
	run: unconditionallyUpdateById(
		Uploads.collection,
		(_existing, filename: string) => ({
			$set: {name: filename},
		}),
		'userId',
	),
});
