import {Uploads} from '../../uploads';
import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';
import {AuthenticationLoggedIn} from '../../Authentication';
import schema from '../../../lib/schema';

export default define({
	name: 'uploads.updateFilename',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), schema.string()]),
	transaction: unconditionallyUpdateById(
		Uploads.collection,
		async (_db, _existing, filename: string) => ({
			$set: {name: filename},
		}),
		'userId',
	),
	async simulate(uploadId, filename) {
		await Uploads.collection.updateAsync(uploadId, {
			$set: {name: filename},
		});
		return undefined;
	},
});
