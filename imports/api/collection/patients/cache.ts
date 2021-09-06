import {Mongo} from 'meteor/mongo';
import CacheItem from '../../CacheItem';

export const cacheCollection = 'patients.find.cache';
export const PatientsCache = new Mongo.Collection<CacheItem>(cacheCollection);
