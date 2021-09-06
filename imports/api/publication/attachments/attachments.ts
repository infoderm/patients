import {Attachments} from '../../collection/attachments';

import define from '../define';

export default define({
	name: 'attachments',
	cursor(query, options) {
		const selector = {
			...query,
			userId: this.userId,
		};
		return Attachments.find(selector, options);
	},
});
