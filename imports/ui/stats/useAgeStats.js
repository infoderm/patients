import {Patients} from '../../api/patients';
import makeHistogram from './makeHistogram';

const useAgeStats = makeHistogram(Patients, ['key', 'sex']);

export default useAgeStats;
