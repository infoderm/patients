import makeCachedFindOne from '../../api/makeCachedFindOne.js';
import {Patients} from '../../api/patients.js';

const useCachedPatient = makeCachedFindOne(Patients, 'patient');

export default useCachedPatient;
