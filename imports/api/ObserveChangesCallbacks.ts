import {type Mongo} from 'meteor/mongo';

type ObserveChangesCallbacks<T> = Mongo.ObserveChangesCallbacks<T>;

export default ObserveChangesCallbacks;
