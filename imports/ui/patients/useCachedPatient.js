import makeCachedFindOne from '../../api/makeCachedFindOne';
import {Patients} from '../../api/patients';

const useCachedPatient = makeCachedFindOne(Patients, 'patient');

export default useCachedPatient;
