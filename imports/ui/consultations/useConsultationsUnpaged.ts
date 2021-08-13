import makeQuery from '../../api/makeQuery';
import {Consultations} from '../../api/consultations';

const useConsultationsUnpaged = makeQuery(Consultations, 'consultations');

export default useConsultationsUnpaged;
