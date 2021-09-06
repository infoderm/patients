import {Consultations} from '../../collection/consultations';
import pageQuery from '../../pageQuery';
import define from '../define';

export default define({
	name: 'consultationsAndAppointments',
	cursor: pageQuery(Consultations),
});
