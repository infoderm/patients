import {Patients} from '../../api/patients.js';
import useHistogram from './useHistogram.js';

const useAgeStats = () => useHistogram(Patients, ['key', 'sex']);

export default useAgeStats;
