import makeDebouncedResultsQuery from '../../api/makeDebouncedResultsQuery';
import {Consultations} from '../../api/collection/consultations';
import publication from '../../api/publication/consultationsAndAppointments/find';

const useConsultationsAndAppointments = makeDebouncedResultsQuery(
	Consultations,
	publication,
);

export default useConsultationsAndAppointments;
