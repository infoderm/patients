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
	transaction: unconditionallyUpdateById(
		Uploads.collection,
		async (_db, _existing, filename: string) => ({
			$set: {name: filename},
		}),
		'userId',
	),
	simulate(uploadId: string, filename: string): void {
		Uploads.collection.update(uploadId, {
			$set: {name: filename},
		});
	},
});
