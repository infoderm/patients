import {Patients} from '../../api/patients.js';
import useHistogram from './useHistogram.js';

const useSexStats = () => useHistogram(Patients, ['sex']);

export default useSexStats;
