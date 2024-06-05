declare module 'meteor/diff-sequence' {
	import {type Mongo} from 'meteor/mongo';
	import {type Document} from 'mongodb';

	type Options<T> = {
		projectionFn?: (document: T) => Partial<T>;
	};

	namespace DiffSequence {
		function diffQueryOrderedChanges<T extends Document>(
			old_results: T[],
			new_results: T[],
			observer: Mongo.ObserveChangesCallbacks<T>,
			options?: Options<T> | undefined,
		): void;
	}
}
