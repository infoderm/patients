import makeFindOne from '../../api/makeFindOne';
import {Patients} from '../../api/patients';

const usePatient = makeFindOne(Patients, 'patient');

export default usePatient;
