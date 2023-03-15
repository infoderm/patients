import {AuthenticationLoggedIn} from '../../Authentication';
import {Books} from '../../collection/books';
import pageQuery, {publicationSchema} from '../../pageQuery';
import define from '../define';

const publication = 'books';

export default define({
	name: publication,
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema,
	cursor: pageQuery(Books),
});
