import {check} from 'meteor/check';
import {asyncIterableToArray} from '@async-iterable-iterator/async-iterable-to-array';
import TransactionDriver from './transaction/TransactionDriver';

const id = (x) => x;

export type Entry<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T];

export const yieldKey = function* <T, K extends keyof T>(
	fields: T,
	key: K,
	type,
	transform = id,
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
	transform = id,
): IterableIterator<[K, T[K]]> {
	if (Object.prototype.hasOwnProperty.call(fields, key)) {
		if (fields[key] !== undefined) check(fields[key], type);
		yield [key, transform(fields[key])];
	}
};

export const simulateUpdate = <T>(state: undefined | T, {$set, $unset}): T => {
	const removedKeys = new Set(Object.keys($unset));
	return Object.fromEntries(
		Object.entries(state ?? {})
			.filter(([key]) => !removedKeys.has(key))
			.concat(Object.entries($set)),
	) as unknown as T;
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
	<T>(computedFields: ComputedFields<T>) =>
	async (
		db: TransactionDriver,
		owner: string,
		state: undefined | T,
		{$set: $setGiven, $unset},
	) => {
		const intermediateState = simulateUpdate(state, {$set: $setGiven, $unset});
		const computed = await computedFields(db, owner, intermediateState);
		const newState = simulateUpdate(intermediateState, {
			$set: computed,
			$unset: {},
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

type SanitizeUpdate<T, U> = (fields: Partial<T>) => IterableIterator<Entry<U>>;

interface SanitizeReturnValue<U> {
	$set: Partial<U>;
	$unset: Record<keyof U, boolean>;
}

export const makeSanitize =
	<T, U>(sanitizeUpdate: SanitizeUpdate<T, U>) =>
	(fields: Partial<T>): SanitizeReturnValue<U> => {
		const update = Array.from(sanitizeUpdate(fields));
		return {
			$set: Object.fromEntries(
				update.filter(([, value]) => value !== undefined),
			) as Partial<U>,
			$unset: Object.fromEntries(
				update
					.filter(([, value]) => value === undefined)
					.map(([key]) => [key, true]),
			) as Record<keyof U, boolean>,
		};
	};
