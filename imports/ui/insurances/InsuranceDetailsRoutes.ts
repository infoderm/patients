import byName from '../routes/byName';
import paged from '../routes/paged';

import InsuranceDetails from './InsuranceDetails';

const InsuranceDetailsRoutes = byName(paged(InsuranceDetails));

export default InsuranceDetailsRoutes;
