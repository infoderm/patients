import {AuthenticationLoggedIn} from '../../Authentication';
import {Books, bookDocument} from '../../collection/books';
import pageQuery, {publicationSchema} from '../../query/pageQuery';
import define from '../define';

const publication = 'books';

export default define({
	name: publication,
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema(bookDocument),
	cursor: pageQuery(Books, ({userId}) => ({owner: userId})),
});
