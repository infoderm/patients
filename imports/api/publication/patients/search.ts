import {PatientsSearchIndex} from '../../collection/patients/search';
import {indexObservedQueryCacheCollection} from '../../collection/patients/search/cache';
import makeObservedQueryPublication from '../../makeObservedQueryPublication';
import define from '../define';

const indexCachePublication = 'patients.index.cache.publication';

export default define({
	name: indexCachePublication,
	handle: makeObservedQueryPublication(
		PatientsSearchIndex,
		indexObservedQueryCacheCollection,
	),
});
