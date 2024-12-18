import makeObservedQueryHook from '../../api/makeObservedQueryHook';
import {PatientsCache} from '../../api/collection/patients/cache';

import publication from '../../api/publication/patients/observe';

const useObservedPatients = makeObservedQueryHook(PatientsCache, publication, {changed: true});

export default useObservedPatients;
