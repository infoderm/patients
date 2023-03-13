import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Attachments} from '../../collection/attachments';

import define from '../define';

export default define({
	name: 'attachment',
	authentication: AuthenticationLoggedIn,
	cursor(_id: string) {
		check(_id, String);
		return Attachments.find({userId: this.userId, _id});
	},
});
