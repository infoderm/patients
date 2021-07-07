import makeItem from '../tags/makeItem';

import {Doctors, doctors} from '../../api/doctors';

const useDoctor = makeItem(Doctors, doctors.options.singlePublication);

export default useDoctor;
