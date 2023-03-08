import {Patients} from '../../api/collection/patients';
import makeHistogram from './makeHistogram';

const useAgeStats = makeHistogram<Record<string, {}>>(Patients, ['key', 'sex']);

export default useAgeStats;
