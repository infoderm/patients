import makeFindOne from '../../api/makeFindOne';
import {Patients} from '../../api/collection/patients';

import publication from '../../api/publication/patients/patients';

const usePatient = makeFindOne(Patients, publication);

export default usePatient;
