import {AuthenticationLoggedIn} from '../../Authentication';
import {Patients} from '../../collection/patients';
import {cacheCollection} from '../../collection/patients/cache';

import makeObservedQueryPublication from '../../makeObservedQueryPublication';
import define from '../define';

export default define({
	name: 'patients.find.observe',
	authentication: AuthenticationLoggedIn,
	handle: makeObservedQueryPublication(Patients, cacheCollection),
});
