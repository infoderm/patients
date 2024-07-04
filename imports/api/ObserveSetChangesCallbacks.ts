import {type Mongo} from 'meteor/mongo';

type ObserveSetChangesCallbacks<T> = Pick<
	Mongo.ObserveChangesCallbacks<T>,
	'added' | 'changed' | 'removed'
>;

export default ObserveSetChangesCallbacks;
