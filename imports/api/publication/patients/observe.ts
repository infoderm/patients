import {Patients} from '../../collection/patients';
import {cacheCollection} from '../../collection/patients/cache';

import makeObservedQueryPublication from '../../makeObservedQueryPublication';
import define from '../define';

const cachePublication = 'patients.find.observe';

export default define({
	name: cachePublication,
	handle: makeObservedQueryPublication(Patients, cacheCollection),
});
