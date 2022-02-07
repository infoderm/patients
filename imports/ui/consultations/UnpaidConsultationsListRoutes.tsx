import byYear from '../routes/byYear';

import UnpaidConsultationsList from './UnpaidConsultationsList';

const UnpaidConsultationsListRoutes = byYear(UnpaidConsultationsList);

export default UnpaidConsultationsListRoutes;
