import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {
	type AttachmentDocument,
	Attachments,
} from '../../collection/attachments';
import type Options from '../../Options';

import define from '../define';

export default define({
	name: 'attachment',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([
		schema.string(),
		schema
			.object({
				/* TODO */
			})
			.nullable(),
	]),
	cursor(_id, options: Options<AttachmentDocument> | null) {
		return Attachments.find({userId: this.userId, _id}, options ?? undefined);
	},
});
