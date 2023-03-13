import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {
	type AttachmentDocument,
	Attachments,
} from '../../collection/attachments';
import type Options from '../../Options';
import type Selector from '../../Selector';
import type Filter from '../../transaction/Filter';

import define from '../define';

export default define({
	name: 'attachments',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([
		schema.object({
			/* TODO Filter<AttachmentDocument> */
		}),
		schema
			.object({
				/* TODO Options<AttachmentDocument> */
			})
			.optional(),
	]),
	cursor(
		filter: Filter<AttachmentDocument>,
		options?: Options<AttachmentDocument>,
	) {
		const selector = {
			...filter,
			userId: this.userId,
		} as Selector<AttachmentDocument>;

		return Attachments.find(selector, options);
	},
});
