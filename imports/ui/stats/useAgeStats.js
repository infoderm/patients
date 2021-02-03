import {Patients} from '../../api/patients.js';
import makeHistogram from './makeHistogram.js';

const useAgeStats = makeHistogram(Patients, ['key', 'sex']);

export default useAgeStats;
