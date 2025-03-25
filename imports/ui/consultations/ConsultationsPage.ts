import makeConsultationsPage from './makeConsultationsPage';

import useConsultationsAndAppointments from './useConsultationsAndAppointments';

const ConsultationsPage = makeConsultationsPage(
	useConsultationsAndAppointments,
);

export default ConsultationsPage;
