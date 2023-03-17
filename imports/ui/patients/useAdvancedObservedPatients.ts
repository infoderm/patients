import {type PatientSearchIndexDocument} from '../../api/collection/patients/search';
import {PatientsSearchIndexCache} from '../../api/collection/patients/search/cache';
import makeObservedQueryHook from '../../api/makeObservedQueryHook';

import publication from '../../api/publication/patients/search';

const useAdvancedObservedPatients =
	makeObservedQueryHook<PatientSearchIndexDocument>(
		PatientsSearchIndexCache,
		publication,
	);

export default useAdvancedObservedPatients;
