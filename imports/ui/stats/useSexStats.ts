import {Patients} from '../../api/collection/patients';
import makeHistogram from './makeHistogram';

const useSexStats = makeHistogram<number>(Patients, ['sex']);

export default useSexStats;
