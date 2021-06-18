import {Patients} from '../../api/patients';
import makeHistogram from './makeHistogram';

const useSexStats = makeHistogram(Patients, ['sex']);

export default useSexStats;
