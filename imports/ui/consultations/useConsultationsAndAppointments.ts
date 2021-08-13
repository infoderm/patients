import makeQuery from '../../api/makeQuery';
import {Consultations} from '../../api/consultations';

const useConsultationsAndAppointments = makeQuery(
	Consultations,
	'consultationsAndAppointments',
);

export default useConsultationsAndAppointments;
