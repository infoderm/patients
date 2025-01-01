import {asyncIterableToArray} from '@async-iterable-iterator/async-iterable-to-array';

import type schema from '../lib/schema';

import {type DocumentUpdate} from './DocumentUpdate';
import type TransactionDriver from './transaction/TransactionDriver';

const id = <T>(x: T): T => x;

export type Entry<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T];

export type UpdateEntry<T> = {
	[K in keyof T]: [K, T[K] | null];
}[keyof T];

export const yieldKey = function* <T, K extends keyof T>(
	fields: T,
	key: K,
	type: schema.ZodType<Exclude<T[K], undefined | null>>,
	transform: (
		x: Exclude<T[K], undefined | null>,
	) => Exclude<T[K], undefined | null> = id<Exclude<T[K], undefined | null>>,
): IterableIterator<[K, Exclude<T[K], undefined | null>]> {
	if (Object.prototype.hasOwnProperty.call(fields, key)) {
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
	if (Object.prototype.hasOwnProperty.call(fields, key)) {
		type.nullable().optional().parse(fields[key]);
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

type SanitizeUpdate<T, U> = (
	fields: DocumentUpdate<T>,
) => IterableIterator<UpdateEntry<U>>;

const fromEntries = <K extends string | number | symbol, V>(
	entries: Array<[K, V]>,
): undefined | Record<K, V> =>
	entries.length === 0
		? undefined
		: (Object.fromEntries(entries) as Record<K, V>);

export const makeSanitize =
	<T, U>(sanitizeUpdate: SanitizeUpdate<T, U>) =>
	(fields: DocumentUpdate<T>) => {
		const update = Array.from(sanitizeUpdate(fields));
		return {
			$set: fromEntries(
				update.filter(([, value]) => value !== undefined && value !== null),
			) as Partial<U>,
			$unset: fromEntries(
				update
					.filter(([, value]) => value === undefined || value === null)
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

export const isDiffEmpty = (obj: any) => Object.keys(obj).length === 0;
