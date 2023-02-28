import Collection from '../../Collection';
import type CacheItem from '../../CacheItem';
import {type PatientDocument} from '../patients';

export const cacheCollection = 'patients.find.cache';
export const PatientsCache = new Collection<CacheItem<PatientDocument>>(
	cacheCollection,
);
