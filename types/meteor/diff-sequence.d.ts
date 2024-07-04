declare module 'meteor/diff-sequence' {
	import {type Mongo} from 'meteor/mongo';
	import {type Document} from 'mongodb';

	type Options<T> = {
		projectionFn?: (document: T) => Partial<T>;
	};

	namespace DiffSequence {
		function diffQueryChanges<T extends Document>(
			ordered: boolean,
			old_results: T[],
			new_results: T[],
			observer: Mongo.ObserveChangesCallbacks<T>,
			options?: Options<T> | undefined,
		): void;

		function diffQueryOrderedChanges<T extends Document>(
			old_results: T[],
			new_results: T[],
			observer: Mongo.ObserveChangesCallbacks<T>,
			options?: Options<T> | undefined,
		): void;

		function applyChanges<T extends Document>(
			document: T,
			changes: Partial<T>,
		): void;
	}
}
