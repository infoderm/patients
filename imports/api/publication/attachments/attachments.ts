import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {
	type AttachmentDocument,
	Attachments,
} from '../../collection/attachments';
import type Options from '../../QueryOptions';
import type Selector from '../../QuerySelector';
import type Filter from '../../QueryFilter';

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
			.nullable(),
	]),
	cursor(
		filter: Filter<AttachmentDocument>,
		options: Options<AttachmentDocument> | null,
	) {
		const selector = {
			...filter,
			userId: this.userId,
		} as Selector<AttachmentDocument>;

		return Attachments.find(selector, options ?? undefined);
	},
});
