import {EJSON} from 'meteor/ejson';

import {asyncIterableToArray} from '@async-iterable-iterator/async-iterable-to-array';

import type schema from '../util/schema';

import type Document from './Document';
import {
	type DocumentUpdateEntry as UpdateEntry,
	type DocumentUpdate,
	type OptionalKeys,
	type RequiredKeys,
} from './DocumentUpdate';
import type TransactionDriver from './transaction/TransactionDriver';
import {type Changes} from './Changes';

const id = <T>(x: T): T => x;

export type Entry<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T];

const _hasOwn = Object.prototype.hasOwnProperty;
const hasOwn = <T>(object: T, property: string | number | symbol) =>
	_hasOwn.call(object, property);

export const yieldKey = function* <T, K extends keyof T>(
	fields: T,
	key: K,
	type: schema.ZodType<Exclude<T[K], undefined | null>>,
	transform: (
		x: Exclude<T[K], undefined | null>,
	) => Exclude<T[K], undefined | null> = id<Exclude<T[K], undefined | null>>,
): IterableIterator<[K, Exclude<T[K], undefined | null>]> {
	if (hasOwn(fields, key)) {
		const value = fields[key] as Exclude<T[K], undefined | null>;
		type.parse(value);
		yield [key, transform(value)];
	}
};

export const yieldResettableKey = function* <T, K extends keyof T>(
	fields: T,
	key: K,
	type: schema.ZodType<T[K]>,
	transform: (x: T[K]) => T[K] = id<T[K]>,
): IterableIterator<[K, T[K]]> {
	if (hasOwn(fields, key)) {
		type.nullable().optional().parse(fields[key]);
		yield [key, transform(fields[key])];
	}
};

export const simulateUpdate = <T extends {}>(
	state: undefined | T,
	{$set, $unset}: Changes<T>,
): T => {
	let entries = state === undefined ? [] : Object.entries(state);
	if ($unset !== undefined) {
		const removedKeys = new Set(Object.keys($unset));
		entries = entries.filter(([key]) => !removedKeys.has(key));
	}

	if ($set !== undefined) {
		entries = entries.concat(Object.entries($set));
	}

	return Object.fromEntries(entries) as unknown as T;
};

type ComputedFieldsGenerator<T> = (
	db: TransactionDriver,
	owner: string,
	state: Partial<T>,
) => AsyncIterableIterator<Entry<T>>;

type ComputedFields<T> = (
	db: TransactionDriver,
	owner: string,
	state: Partial<T>,
) => Promise<Partial<T>>;

export const makeComputedFields =
	<T>(computedFieldsGenerator: ComputedFieldsGenerator<T>): ComputedFields<T> =>
	async (db: TransactionDriver, owner: string, state: Partial<T>) => {
		const entries = await asyncIterableToArray(
			computedFieldsGenerator(db, owner, state),
		);
		return Object.fromEntries(entries) as Partial<T>;
	};

export const makeComputeUpdate =
	<T extends {}>(computedFields: ComputedFields<T>) =>
	async (
		db: TransactionDriver,
		owner: string,
		state: undefined | T,
		{$set: $setGiven, $unset}: Changes<T>,
	) => {
		const intermediateState = simulateUpdate(state, {$set: $setGiven, $unset});
		const computed = await computedFields(db, owner, intermediateState);
		const newState = simulateUpdate(intermediateState, {
			$set: computed,
		});
		const $set = {
			...$setGiven,
			...computed,
		};
		return {
			newState,
			$set,
			$unset,
		};
	};

type SanitizeUpdate<T extends Document, U extends Document> = (
	fields: DocumentUpdate<T>,
) => IterableIterator<UpdateEntry<U>>;

export const makeSanitize =
	<T extends Document, U extends Document>(
		sanitizeUpdate: SanitizeUpdate<T, U>,
	) =>
	(fields: DocumentUpdate<T>): Required<Changes<U>> => {
		const update = Array.from(sanitizeUpdate(fields));
		return {
			$set: Object.fromEntries(
				update.filter(([, value]) => value !== undefined && value !== null),
			),
			$unset: Object.fromEntries(
				update
					.filter(([, value]) => value === undefined || value === null)
					.map(([key]) => [key, true]),
			) as {[K in keyof U]?: boolean},
		};
	};

const documentDiffGen = function* <T extends Document, U extends Document>(
	prevState: T,
	newState: U,
): IterableIterator<UpdateEntry<T>> {
	const newIndex = new Map<keyof T, T[keyof T]>(Object.entries(newState));
	const prevIndex = new Map<keyof T, T[keyof T]>(Object.entries(prevState));
	for (const [key, newValue] of newIndex) {
		if (
			!EJSON.equals(
				newValue,
				// @ts-expect-error Typing of EJSON.equals is incorrect.
				prevIndex.get(key),
			)
		) {
			yield [key as RequiredKeys<T> & OptionalKeys<T>, newValue];
		}
	}

	for (const key of prevIndex.keys()) {
		if (!newIndex.has(key)) {
			yield [key as OptionalKeys<T>, null];
		}
	}
};

export const documentDiff = <T extends Document, U extends Document>(
	prevState: T,
	newState: U,
): DocumentUpdate<T> =>
	Object.fromEntries(documentDiffGen(prevState, newState)) as DocumentUpdate<T>;

export const documentDiffApplyGen = function* <T extends Document>(
	prevState: T,
	changes: DocumentUpdate<T>,
): IterableIterator<Entry<T>> {
	const index = new Map(Object.entries(changes));
	for (const [key, value] of Object.entries(prevState)) {
		if (index.has(key)) {
			const newValue = index.get(key);
			if (newValue !== undefined && newValue !== null) {
				yield [key, newValue as T[keyof T]];
			}

			index.delete(key);
		} else {
			yield [key, value];
		}
	}

	for (const [key, newValue] of index) {
		if (newValue !== undefined && newValue !== null) {
			yield [key, newValue as T[keyof T]];
		}
	}
};

export const documentDiffApply = <T extends Document>(
	prevState: T,
	changes: DocumentUpdate<T>,
): T => {
	return Object.fromEntries(documentDiffApplyGen(prevState, changes)) as T;
};

export const isDiffEmpty = <T extends Document>(obj: DocumentUpdate<T>) =>
	Object.keys(obj).length === 0;

export {type DocumentUpdateEntry as UpdateEntry} from './DocumentUpdate';
