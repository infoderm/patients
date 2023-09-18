import type CacheItem from '../../CacheItem';
import {type PatientDocument} from '../patients';
import define from '../define';

export const cacheCollection = 'patients.find.cache';
export const PatientsCache =
	define<CacheItem<PatientDocument>>(cacheCollection);
