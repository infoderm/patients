import {Mongo} from 'meteor/mongo';

import CacheItem from './CacheItem';

type ObservedQueryCacheCollection<T> = Mongo.Collection<CacheItem<T>>;

export default ObservedQueryCacheCollection;
