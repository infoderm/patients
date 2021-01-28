import makeCachedFindOne from '../../api/makeCachedFindOne.js';
import {Consultations} from '../../api/consultations.js';

const useConsultation = makeCachedFindOne(Consultations, 'consultation');

export default useConsultation;
