import byName from '../routes/byName';
import paged from '../routes/paged';
import AllergyDetails from './AllergyDetails';

const AllergyDetailsRoutes = byName(paged(AllergyDetails));

export default AllergyDetailsRoutes;
