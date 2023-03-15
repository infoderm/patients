import {AuthenticationLoggedIn} from '../../Authentication';
import {Patients} from '../../collection/patients';
import pageQuery, {publicationSchema} from '../../pageQuery';

import define from '../define';

export default define({
	name: 'patients',
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema,
	cursor: pageQuery(Patients),
});
