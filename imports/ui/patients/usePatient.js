import makeFindOne from '../../api/makeFindOne.js';
import {Patients} from '../../api/patients.js';

const usePatient = makeFindOne(Patients, 'patient');

export default usePatient;
