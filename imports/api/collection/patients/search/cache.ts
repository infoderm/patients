import Collection from '../../../Collection';
import type CacheItem from '../../../CacheItem';
import {type SexAllowed} from '../../patients';

export const indexObservedQueryCacheCollection =
	'patients.index.cache.collection';

export type PatientCacheResult = {
	_id: string;
	firstnameWords: string[];
	lastnameWords: string[];
	innerTrigrams: string[];
	outerTrigrams: string[];
	niss: string;
	firstname: string;
	lastname: string;
	birthdate: string;
	deathdateModifiedAt?: Date;
	lastModifiedAt: Date;
	sex: SexAllowed;
	owner: string;
};

export type PatientCacheItem = CacheItem<PatientCacheResult>;

export const PatientsSearchIndexCache = new Collection<PatientCacheItem>(
	indexObservedQueryCacheCollection,
);
