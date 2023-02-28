import type CacheItem from '../../CacheItem';
import Collection from '../../Collection';
import {FIND_CACHE_SUFFIX} from '../../createTagCollection';

import {type BookDocument, collection} from '../books';

export const cacheCollection = collection + FIND_CACHE_SUFFIX;
export const BooksCache = new Collection<CacheItem<BookDocument>>(
	cacheCollection,
);
