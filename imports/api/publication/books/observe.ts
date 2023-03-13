import makeObservedQueryPublication, {
	publicationSchema,
} from '../../makeObservedQueryPublication';
import define from '../define';
import {Books, collection} from '../../collection/books';
import {cacheCollection} from '../../collection/books/cache';
import {FIND_OBSERVE_SUFFIX} from '../../createTagCollection';
import {AuthenticationLoggedIn} from '../../Authentication';

const cachePublication = collection + FIND_OBSERVE_SUFFIX;

export default define({
	name: cachePublication,
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema,
	handle: makeObservedQueryPublication(Books, cacheCollection),
});
