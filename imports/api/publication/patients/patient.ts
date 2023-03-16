import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {type PatientDocument, Patients} from '../../collection/patients';
import type Options from '../../QueryOptions';

import define from '../define';

export default define({
	name: 'patient',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([
		schema.string(),
		schema
			.object({
				/* TODO */
			})
			.nullable(),
	]),
	cursor(_id, options: Options<PatientDocument> | null) {
		return Patients.find({owner: this.userId, _id}, options ?? undefined);
	},
});
