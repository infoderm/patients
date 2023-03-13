import {check} from 'meteor/check';
import {asyncIterableToArray} from '@async-iterable-iterator/async-iterable-to-array';
import type TransactionDriver from './transaction/TransactionDriver';

const id = <T>(x: T): T => x;

export type Entry<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T];

export const yieldKey = function* <T, K extends keyof T>(
	fields: T,
	key: K,
	type,
	transform: (x: T[K]) => T[K] = id<T[K]>,
): IterableIterator<[K, T[K]]> {
	if (Object.prototype.hasOwnProperty.call(fields, key)) {
		check(fields[key], type);
		yield [key, transform(fields[key])];
	}
};

export const yieldResettableKey = function* <T, K extends keyof T>(
	fields: T,
	key: K,
	type,
	transform: (x: T[K]) => T[K] = id<T[K]>,
): IterableIterator<[K, T[K]]> {
	if (Object.prototype.hasOwnProperty.call(fields, key)) {
		if (fields[key] !== undefined) check(fields[key], type);
		yield [key, transform(fields[key])];
	}
};

type Changes<T> = {
	$set?: Partial<T>;
	$unset?: {
		[K in keyof T]?: boolean;
	};
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

type SanitizeUpdate<T, U> = (fields: T) => IterableIterator<Entry<U>>;

const fromEntries = <K extends string | number | symbol, V>(
	entries: Array<[K, V]>,
): undefined | Record<K, V> =>
	entries.length === 0
		? undefined
		: (Object.fromEntries(entries) as Record<K, V>);

export const makeSanitize =
	<T, U>(sanitizeUpdate: SanitizeUpdate<T, U>) =>
	(fields: T) => {
		const update = Array.from(sanitizeUpdate(fields));
		return {
			$set: fromEntries(
				update.filter(([, value]) => value !== undefined),
			) as Partial<U>,
			$unset: fromEntries(
				update
					.filter(([, value]) => value === undefined)
					.map(([key]) => [key, true]),
			),
		};
	};

const documentDiffGen = function* <T, U extends {}>(
	prevState: T,
	newState: Required<T> extends U ? U : never,
): IterableIterator<Entry<U>> {
	for (const [key, newValue] of Object.entries(newState)) {
		if (JSON.stringify(newValue) !== JSON.stringify(prevState[key])) {
			yield [key as keyof U, newValue as U[keyof U]];
		}
	}
};

export const documentDiff = <T, U extends {}>(
	prevState: T,
	newState: Required<T> extends U ? U : never,
): Partial<U> =>
	Object.fromEntries(documentDiffGen(prevState, newState)) as Partial<U>;
