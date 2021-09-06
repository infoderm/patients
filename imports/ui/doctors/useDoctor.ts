import makeItem from '../tags/makeItem';

import {Doctors} from '../../api/collection/doctors';
import {doctors} from '../../api/doctors';

const useDoctor = makeItem(Doctors, doctors.options._singlePublication);

export default useDoctor;
