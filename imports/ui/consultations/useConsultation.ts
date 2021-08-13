import makeFindOne from '../../api/makeFindOne';
import {Consultations} from '../../api/consultations';

const useConsultation = makeFindOne(Consultations, 'consultation');

export default useConsultation;
