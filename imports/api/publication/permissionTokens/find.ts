import {AuthenticationLoggedIn} from '../../Authentication';
import {PermissionTokens} from '../../collection/permissionTokens';
import pageQuery from '../../pageQuery';
import define from '../define';

export default define({
	name: 'permissionTokens',
	authentication: AuthenticationLoggedIn,
	cursor: pageQuery(PermissionTokens),
});
