import {type Mongo} from 'meteor/mongo';

type ObserveSequenceChangesCallbacks<T> = Pick<
	Mongo.ObserveChangesCallbacks<T>,
	'addedBefore' | 'movedBefore' | 'changed' | 'removed'
>;

export default ObserveSequenceChangesCallbacks;
