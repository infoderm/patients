import byName from '../routes/byName';
import paged from '../routes/paged';
import DoctorDetails from './DoctorDetails';

const DoctorDetailsRoutes = byName(paged(DoctorDetails));

export default DoctorDetailsRoutes;
