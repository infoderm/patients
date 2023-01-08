import {type Mongo} from 'meteor/mongo';

import type CacheItem from './CacheItem';

type ObservedQueryCacheCollection<T> = Mongo.Collection<CacheItem<T>>;

export default ObservedQueryCacheCollection;
