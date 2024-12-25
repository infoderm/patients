import makeObservedQueryHook from '../../api/makeObservedQueryHook';
import cachePublication from '../../api/publication/books/observe';
import {BooksCache} from '../../api/collection/books/cache';

// TODO: rename to useObservedBooks
const useBooksFind = makeObservedQueryHook(BooksCache, cachePublication);

export default useBooksFind;
