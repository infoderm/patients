import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {
	type PatientDocument,
	Patients,
	patientDocument,
} from '../../collection/patients';
import {options} from '../../query/Options';
import type Selector from '../../query/Selector';
import {userFilter} from '../../query/UserFilter';

import define from '../define';

export default define({
	name: '/patients/find',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([userFilter(patientDocument), options(patientDocument)]),
	async run(
		filter,
		options,
	): Promise<Array<Partial<PatientDocument> & {_id: string}>> {
		return Patients.find(
			{...filter, owner: this.userId} as Selector<PatientDocument>,
			options,
		).fetchAsync();
	},
	simulate(_query, _options) {
		return undefined;
	},
});
