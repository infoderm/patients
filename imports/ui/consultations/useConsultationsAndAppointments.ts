import makeQuery from '../../api/makeQuery';
import {Consultations} from '../../api/collection/consultations';
import publication from '../../api/publication/consultationsAndAppointments/find';

const useConsultationsAndAppointments = makeQuery(Consultations, publication);

export default useConsultationsAndAppointments;
