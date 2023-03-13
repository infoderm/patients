import {AuthenticationLoggedIn} from '../../Authentication';
import {Drugs} from '../../collection/drugs';
import pageQuery, {publicationSchema} from '../../pageQuery';
import define from '../define';

export default define({
	name: 'drugs',
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema,
	cursor: pageQuery(Drugs),
});
