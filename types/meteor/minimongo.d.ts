declare module 'meteor/minimongo' {
	import {type Mongo} from 'meteor/mongo';
	import {type Document} from 'mongodb';

	namespace LocalCollection {
		function _observeCallbacksAreOrdered<T extends Document>(
			callbacks: Mongo.ObserveChangesCallbacks<T>,
		): boolean;
	}
}
