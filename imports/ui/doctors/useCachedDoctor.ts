import makeCachedFindOne from '../../api/makeCachedFindOne';

import {Doctors, doctors} from '../../api/doctors';

const useCachedDoctor = makeCachedFindOne(Doctors, doctors.options.publication);

export default useCachedDoctor;
