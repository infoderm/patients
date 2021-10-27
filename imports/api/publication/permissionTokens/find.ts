import {PermissionTokens} from '../../collection/permissionTokens';
import pageQuery from '../../pageQuery';
import define from '../define';

export default define({
	name: 'permissionTokens',
	cursor: pageQuery(PermissionTokens),
});
