import {Patients} from '../../api/patients.js';
import makeHistogram from './makeHistogram.js';

const useSexStats = makeHistogram(Patients, ['sex']);

export default useSexStats;
