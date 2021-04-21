import makeFindOne from '../../api/makeFindOne.js';
import {Consultations} from '../../api/consultations.js';

const useConsultation = makeFindOne(Consultations, 'consultation');

export default useConsultation;
