import withItem from '../tags/withItem.js';

import {Doctors, doctors} from '../../api/doctors.js';

const withDoctor = withItem(Doctors, doctors.options.singlePublication);

export default withDoctor;
