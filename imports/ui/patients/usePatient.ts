import makeFindOne from '../../api/makeFindOne';
import {Patients} from '../../api/collection/patients';

const usePatient = makeFindOne(Patients, 'patient');

export default usePatient;
