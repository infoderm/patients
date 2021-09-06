import {check} from 'meteor/check';
import {Documents} from '../../collection/documents';
import define from '../define';

export default define({
	name: 'document',
	cursor(_id: string) {
		check(_id, String);
		return Documents.find({owner: this.userId, _id});
	},
});
