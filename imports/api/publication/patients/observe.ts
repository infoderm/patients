import {AuthenticationLoggedIn} from '../../Authentication';
import {Patients} from '../../collection/patients';
import {cacheCollection} from '../../collection/patients/cache';

import makeObservedQueryPublication, {
	publicationSchema,
} from '../../makeObservedQueryPublication';
import define from '../define';

export default define({
	name: 'patients.find.observe',
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema,
	handle: makeObservedQueryPublication(Patients, cacheCollection),
});
