import makeQuery from '../../api/makeQuery';
import {Consultations} from '../../api/collection/consultations';
import publication from '../../api/publication/consultations/find';

const useConsultationsUnpaged = makeQuery(Consultations, publication);

export default useConsultationsUnpaged;
