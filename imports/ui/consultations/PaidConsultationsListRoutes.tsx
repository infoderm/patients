import byYear from '../routes/byYear';
import byPaymentMethod from '../routes/byPaymentMethod';

import PaidConsultationsList from './PaidConsultationsList';

const PaidConsultationsListRoutes = byYear(
	byPaymentMethod(PaidConsultationsList),
);

export default PaidConsultationsListRoutes;
