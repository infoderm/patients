import {patientDocument, Patients} from '../../collection/patients';
import {publishCount} from '../../stats';

export default publishCount(Patients, patientDocument, 'sex');
