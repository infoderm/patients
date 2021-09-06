import {Patients} from '../../collection/patients';
import {publishCount} from '../../stats';

export default publishCount(Patients, 'sex');
