declare module 'meteor/diff-sequence' {
	import {type Mongo} from 'meteor/mongo';
	import {type Document} from 'mongodb';

	type DiffOptions<T> = {
		projectionFn?: (document: T) => Partial<T>;
	};

	namespace DiffSequence {
		function diffQueryChanges<T extends Document>(
			ordered: true,
			old_results: T[],
			new_results: T[],
			observer: Mongo.ObserveChangesCallbacks<T>,
			options?: DiffOptions<T> | undefined,
		): void;

		function diffQueryChanges<T extends Document>(
			ordered: false,
			old_results: Map<string, T>,
			new_results: Map<string, T>,
			observer: Mongo.ObserveChangesCallbacks<T>,
			options?: DiffOptions<T> | undefined,
		): void;

		function diffQueryUnorderedChanges<T extends Document>(
			old_results: Map<string, T>,
			new_results: Map<string, T>,
			observer: Mongo.ObserveChangesCallbacks<T>,
			options?: DiffOptions<T> | undefined,
		): void;

		function diffQueryOrderedChanges<T extends Document>(
			old_results: T[],
			new_results: T[],
			observer: Mongo.ObserveChangesCallbacks<T>,
			options?: DiffOptions<T> | undefined,
		): void;

		function applyChanges<T extends Document>(
			document: T,
			changes: Partial<T>,
		): void;
	}
}
