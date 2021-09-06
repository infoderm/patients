import {check} from 'meteor/check';

import {Drugs} from '../../collection/drugs';
import define from '../define';

export default define({
	name: 'drug',
	cursor(_id: string) {
		check(_id, String);
		return Drugs.find({owner: this.userId, _id});
	},
});
