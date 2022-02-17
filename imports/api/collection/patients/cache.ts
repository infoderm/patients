import {Mongo} from 'meteor/mongo';
import CacheItem from '../../CacheItem';
import {PatientDocument} from '../patients';

export const cacheCollection = 'patients.find.cache';
export const PatientsCache = new Mongo.Collection<CacheItem<PatientDocument>>(
	cacheCollection,
);
