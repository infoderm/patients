import type CacheItem from '../../CacheItem';
import {FIND_CACHE_SUFFIX} from '../../createTagCollection';

import {type BookDocument, collection} from '../books';
import define from '../define';

export const cacheCollection = collection + FIND_CACHE_SUFFIX;
export const BooksCache = define<CacheItem<BookDocument>>(cacheCollection);
