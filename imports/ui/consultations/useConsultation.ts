import makeFindOne from '../../api/makeFindOne';
import {Consultations} from '../../api/collection/consultations';

import publication from '../../api/publication/consultations/find';

const useConsultation = makeFindOne(Consultations, publication);

export default useConsultation;
