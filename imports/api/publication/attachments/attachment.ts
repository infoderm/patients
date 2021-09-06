import {check} from 'meteor/check';

import {Attachments} from '../../collection/attachments';

import define from '../define';

export default define({
	name: 'attachment',
	cursor(_id: string) {
		check(_id, String);
		return Attachments.find({userId: this.userId, _id});
	},
});
