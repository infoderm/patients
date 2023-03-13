import {AuthenticationLoggedIn} from '../../Authentication';
import {Consultations} from '../../collection/consultations';
import pageQuery, {publicationSchema} from '../../pageQuery';
import define from '../define';

export default define({
	name: 'consultationsAndAppointments',
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema,
	cursor: pageQuery(Consultations),
});
