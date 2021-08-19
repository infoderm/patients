import makeObservedQueryHook from '../../api/makeObservedQueryHook';
import {cachePublication, PatientsCache} from '../../api/patients';

const useObservedPatients = makeObservedQueryHook(
	PatientsCache,
	cachePublication,
);

export default useObservedPatients;
