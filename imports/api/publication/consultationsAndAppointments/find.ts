import {AuthenticationLoggedIn} from '../../Authentication';
import {Consultations} from '../../collection/consultations';
import pageQuery from '../../pageQuery';
import define from '../define';

export default define({
	name: 'consultationsAndAppointments',
	authentication: AuthenticationLoggedIn,
	cursor: pageQuery(Consultations),
});
