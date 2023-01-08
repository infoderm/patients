import {Mongo} from 'meteor/mongo';
import type CacheItem from '../../CacheItem';
import {type PatientDocument} from '../patients';

export const cacheCollection = 'patients.find.cache';
export const PatientsCache = new Mongo.Collection<CacheItem<PatientDocument>>(
	cacheCollection,
);
