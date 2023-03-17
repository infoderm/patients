import {AuthenticationLoggedIn} from '../../Authentication';
import {
	consultationDocument,
	Consultations,
} from '../../collection/consultations';
import pageQuery, {publicationSchema} from '../../query/pageQuery';
import define from '../define';

export default define({
	name: 'consultations',
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema(consultationDocument),
	cursor: pageQuery(Consultations, ({userId}) => ({
		isDone: true,
		owner: userId,
	})),
});
