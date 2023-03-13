import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Drugs} from '../../collection/drugs';
import define from '../define';

export default define({
	name: 'drug',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	cursor(_id) {
		return Drugs.find({owner: this.userId, _id});
	},
});
