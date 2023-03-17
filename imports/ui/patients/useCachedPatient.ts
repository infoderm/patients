import makeCachedFindOne from '../../api/makeCachedFindOne';
import {Patients} from '../../api/collection/patients';

import publication from '../../api/publication/patients/patients';

const useCachedPatient = makeCachedFindOne(Patients, publication);

export default useCachedPatient;
