import makeItem from '../tags/makeItem.js';

import {Doctors, doctors} from '../../api/doctors.js';

const useDoctor = makeItem(Doctors, doctors.options.singlePublication);

export default useDoctor;
