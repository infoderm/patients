import makeCachedFindOne from '../../api/makeCachedFindOne';
import {Patients} from '../../api/collection/patients';

const useCachedPatient = makeCachedFindOne(Patients, 'patient');

export default useCachedPatient;
