import {check} from 'meteor/check';

import {Uploads} from '../../uploads';
import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';
import {AuthenticationLoggedIn} from '../../Authentication';

export default define({
	name: 'uploads.updateFilename',
	authentication: AuthenticationLoggedIn,
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
	async simulate(uploadId: string, filename: string) {
		await Uploads.collection.updateAsync(uploadId, {
			$set: {name: filename},
		});
		return undefined;
	},
});
