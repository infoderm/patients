import {AuthenticationLoggedIn} from '../../Authentication';
import {PermissionTokens} from '../../collection/permissionTokens';
import pageQuery, {publicationSchema} from '../../pageQuery';
import define from '../define';

export default define({
	name: 'permissionTokens',
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema,
	cursor: pageQuery(PermissionTokens),
});
