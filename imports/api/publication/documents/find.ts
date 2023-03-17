import {AuthenticationLoggedIn} from '../../Authentication';
import {Documents, documentDocument} from '../../collection/documents';
import pageQuery, {publicationSchema} from '../../query/pageQuery';
import define from '../define';

export default define({
	name: 'documents',
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema(documentDocument),
	cursor: pageQuery(Documents, ({userId}) => ({owner: userId})),
});
