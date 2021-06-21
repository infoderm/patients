import {Mongo} from 'meteor/mongo';

import CacheItem from './CacheItem';

type ObservedQueryCacheCollection = Mongo.Collection<CacheItem>;

export default ObservedQueryCacheCollection;
