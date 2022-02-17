import {Mongo} from 'meteor/mongo';
import CacheItem from '../../../CacheItem';
import {SexAllowed} from '../../patients';

export const indexObservedQueryCacheCollection =
	'patients.index.cache.collection';

export interface PatientCacheResult {
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
}

export type PatientCacheItem = CacheItem<PatientCacheResult>;

export const PatientsSearchIndexCache = new Mongo.Collection<PatientCacheItem>(
	indexObservedQueryCacheCollection,
);
