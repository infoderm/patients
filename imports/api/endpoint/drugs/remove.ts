import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Drugs} from '../../collection/drugs';

import define from '../define';
import EndpointError from '../EndpointError';

export default define({
	name: 'drugs.remove',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string()]),
	async run(drugId) {
		const nRemoved = await Drugs.removeAsync({_id: drugId, owner: this.userId});
		if (nRemoved === 0) {
			throw new EndpointError('not-found');
		}

		return nRemoved;
	},
});
