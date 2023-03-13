import {AuthenticationLoggedIn} from '../../Authentication';
import {Drugs} from '../../collection/drugs';
import pageQuery from '../../pageQuery';
import define from '../define';

export default define({
	name: 'drugs',
	authentication: AuthenticationLoggedIn,
	cursor: pageQuery(Drugs),
});
