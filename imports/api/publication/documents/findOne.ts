import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';
import {Documents} from '../../collection/documents';
import define from '../define';

export default define({
	name: 'document',
	authentication: AuthenticationLoggedIn,
	cursor(_id: string) {
		check(_id, String);
		return Documents.find({owner: this.userId, _id});
	},
});
