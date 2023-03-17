import {AuthenticationLoggedIn} from '../../Authentication';
import {drugDocument, Drugs} from '../../collection/drugs';
import pageQuery, {publicationSchema} from '../../query/pageQuery';
import define from '../define';

export default define({
	name: 'drugs',
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema(drugDocument),
	cursor: pageQuery(Drugs, ({userId}) => ({owner: userId})),
});
