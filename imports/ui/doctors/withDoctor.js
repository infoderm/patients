import withItem from '../tags/withItem';

import {Doctors, doctors} from '../../api/doctors';

const withDoctor = withItem(Doctors, doctors.options.singlePublication);

export default withDoctor;
