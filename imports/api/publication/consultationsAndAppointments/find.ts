import {AuthenticationLoggedIn} from '../../Authentication';
import {
	consultationDocument,
	Consultations,
} from '../../collection/consultations';
import pageQuery, {publicationSchema} from '../../query/pageQuery';
import define from '../define';

export default define({
	name: 'consultationsAndAppointments',
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema(consultationDocument),
	cursor: pageQuery(Consultations, ({userId}) => ({owner: userId})),
});
