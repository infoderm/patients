import {AuthenticationLoggedIn} from '../../Authentication';
import {type PatientDocument, Patients} from '../../collection/patients';
import type Options from '../../Options';
import type Selector from '../../Selector';
import type Filter from '../../transaction/Filter';

import define from '../define';

export default define({
	name: 'patients',
	authentication: AuthenticationLoggedIn,
	cursor(filter: Filter<PatientDocument>, options?: Options<PatientDocument>) {
		return Patients.find(
			{...filter, owner: this.userId} as Selector<PatientDocument>,
			options,
		);
	},
});
