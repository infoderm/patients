import makeObservedQueryHook from '../../api/makeObservedQueryHook';
import {
	PatientsSearchIndexCache,
	indexCachePublication,
} from '../../api/patients';

const useAdvancedObservedPatients = makeObservedQueryHook(
	PatientsSearchIndexCache,
	indexCachePublication,
);

export default useAdvancedObservedPatients;
