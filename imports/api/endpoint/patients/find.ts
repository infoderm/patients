import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {type PatientDocument, Patients} from '../../collection/patients';

import define from '../define';

export default define({
	name: '/patients/find',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.object({}), schema.object({})]),
	async run(
		query,
		options,
	): Promise<Array<Partial<PatientDocument> & {_id: string}>> {
		return Patients.find({...query, owner: this.userId}, options).fetchAsync();
	},
	simulate(_query, _options) {
		return undefined;
	},
});
