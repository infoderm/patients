import {AuthenticationLoggedIn} from '../../Authentication';
import {Patients, patientDocument} from '../../collection/patients';
import pageQuery, {publicationSchema} from '../../query/pageQuery';

import define from '../define';

export default define({
	name: 'patients',
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema(patientDocument),
	cursor: pageQuery(Patients, ({userId}) => ({owner: userId})),
});
