import {AuthenticationLoggedIn} from '../../Authentication';
import {
	patientSearchIndexDocument,
	PatientsSearchIndex,
} from '../../collection/patients/search';
import {indexObservedQueryCacheCollection} from '../../collection/patients/search/cache';
import makeObservedQueryPublication, {
	publicationSchema,
} from '../../makeObservedQueryPublication';
import define from '../define';

const indexCachePublication = 'patients.index.cache.publication';

export default define({
	name: indexCachePublication,
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema(patientSearchIndexDocument),
	handle: makeObservedQueryPublication(
		PatientsSearchIndex,
		indexObservedQueryCacheCollection,
	),
});
