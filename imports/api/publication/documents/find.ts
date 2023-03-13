import {AuthenticationLoggedIn} from '../../Authentication';
import {Documents} from '../../collection/documents';
import pageQuery, {publicationSchema} from '../../pageQuery';
import define from '../define';

export default define({
	name: 'documents',
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema,
	cursor: pageQuery(Documents),
});
