import {AuthenticationLoggedIn} from '../../Authentication';
import {
	PermissionTokens,
	permissionTokenDocument,
} from '../../collection/permissionTokens';
import pageQuery, {publicationSchema} from '../../query/pageQuery';
import define from '../define';

export default define({
	name: 'permissionTokens',
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema(permissionTokenDocument),
	cursor: pageQuery(PermissionTokens, ({userId}) => ({owner: userId})),
});
