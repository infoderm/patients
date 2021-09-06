import makeFindOne from '../../api/makeFindOne';
import {Consultations} from '../../api/collection/consultations';

const useConsultation = makeFindOne(Consultations, 'consultation');

export default useConsultation;
