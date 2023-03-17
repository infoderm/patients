import Collection from '../../../Collection';
import type schema from '../../../../lib/schema';
import {cacheItem} from '../../../CacheItem';
import {patientSearchIndexDocument} from '../search';

export const indexObservedQueryCacheCollection =
	'patients.index.cache.collection';

export const patientCacheItem = cacheItem(patientSearchIndexDocument);

export type PatientCacheItem = schema.infer<typeof patientCacheItem>;

export const PatientsSearchIndexCache = new Collection<PatientCacheItem>(
	indexObservedQueryCacheCollection,
);
