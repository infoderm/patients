import makeQuery from '../../api/makeQuery';
import {Consultations} from '../../api/consultations';

const useConsultationsFind = makeQuery(Consultations, 'consultations');

export default useConsultationsFind;
