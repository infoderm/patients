import {Patients} from '../../api/collection/patients';
import makeHistogram from './makeHistogram';

const useSexStats = makeHistogram(Patients, ['sex']);

export default useSexStats;
