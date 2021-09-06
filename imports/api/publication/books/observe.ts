import makeObservedQueryPublication from '../../makeObservedQueryPublication';
import define from '../define';
import {Books, collection} from '../../collection/books';
import {cacheCollection} from '../../collection/books/cache';
import {FIND_OBSERVE_SUFFIX} from '../../createTagCollection';

const cachePublication = collection + FIND_OBSERVE_SUFFIX;

export default define({
	name: cachePublication,
	handle: makeObservedQueryPublication(Books, cacheCollection),
});
