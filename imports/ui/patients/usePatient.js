import makeCachedFindOne from '../../api/makeCachedFindOne.js';
import {Patients} from '../../api/patients.js';

const usePatient = makeCachedFindOne(Patients, 'patient');

export default usePatient;
