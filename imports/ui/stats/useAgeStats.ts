import {Patients} from '../../api/collection/patients';
import makeHistogram from './makeHistogram';

const useAgeStats = makeHistogram(Patients, ['key', 'sex']);

export default useAgeStats;
