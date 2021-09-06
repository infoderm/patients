import makeCachedFindOne from '../../api/makeCachedFindOne';
import {Patients} from '../../api/collection/patients';
import patient from '../../api/publication/patients/patient';

const useCachedPatient = makeCachedFindOne(Patients, patient);

export default useCachedPatient;
