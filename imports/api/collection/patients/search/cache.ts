import {Mongo} from 'meteor/mongo';
import CacheItem from '../../../CacheItem';

export const indexObservedQueryCacheCollection =
	'patients.index.cache.collection';
export const PatientsSearchIndexCache = new Mongo.Collection<CacheItem>(
	indexObservedQueryCacheCollection,
);
