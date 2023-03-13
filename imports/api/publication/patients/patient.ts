import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {type PatientDocument, Patients} from '../../collection/patients';
import type Options from '../../Options';

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
			.optional(),
	]),
	cursor(_id, options?: Options<PatientDocument>) {
		return Patients.find({owner: this.userId, _id}, options);
	},
});
