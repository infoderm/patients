import {Mongo} from 'meteor/mongo';

import CacheItem from '../../CacheItem';
import {FIND_CACHE_SUFFIX} from '../../createTagCollection';

import {BookDocument, collection} from '../books';

export const cacheCollection = collection + FIND_CACHE_SUFFIX;
export const BooksCache = new Mongo.Collection<CacheItem<BookDocument>>(
	cacheCollection,
);
