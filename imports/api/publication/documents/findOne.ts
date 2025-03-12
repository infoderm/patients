import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {Documents} from '../../collection/documents';
import define from '../define';

export default define({
	name: 'document',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	cursor(_id) {
		return Documents.find({owner: this.userId, _id});
	},
});
