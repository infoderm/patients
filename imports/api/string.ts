import assert from 'assert';

import deburr from 'lodash.deburr';
import mem from 'mem';

import {all, min} from '@iterable-iterator/reduce';
import {list} from '@iterable-iterator/list';
import {len} from '@functional-abstraction/operator';
import {map} from '@iterable-iterator/map';
import {_chain} from '@iterable-iterator/chain';
import {sorted} from '@iterable-iterator/sorted';
import {window} from '@iterable-iterator/window';
import {increasing} from '@total-order/primitive';
import {len as byLength} from '@total-order/key';
import {combinations} from '@combinatorics/n-combinations';
import {product} from '@set-theory/cartesian-product';
import escapeStringRegexp from 'escape-string-regexp';

import schema from '../util/schema';

export {default as escapeStringRegexp} from 'escape-string-regexp';

export const formattedLineInputSchema = schema
	.string()
	.brand<'FORMATTED-LINE-INPUT'>();
export type FormattedLineInput = schema.infer<typeof formattedLineInputSchema>;
export const formattedLineSchema = schema.string().brand<'FORMATTED-LINE'>();
export type FormattedLine = schema.infer<typeof formattedLineSchema>;
export const transliteratedLineInputSchema = schema
	.string()
	.brand<'TRANSLITERATED-LINE-INPUT'>();
export type TransliteratedLineInput = schema.infer<
	typeof transliteratedLineInputSchema
>;

export const transliteratedLineSchema = schema
	.string()
	.brand<'TRANSLITERATED-LINE'>();
export type TransliteratedLine = schema.infer<typeof transliteratedLineSchema>;
export const normalizedLineInputSchema = schema
	.string()
	.brand<'NORMALIZED-LINE-INPUT'>();
export type NormalizedLineInput = schema.infer<
	typeof normalizedLineInputSchema
>;
export const normalizedLineSchema = schema.string().brand<'NORMALIZED-LINE'>();
export type NormalizedLine = schema.infer<typeof normalizedLineSchema>;

export const normalizeWhiteSpace = (string: string) =>
	string.replace(/\s+/g, ' ');

export const formattedLineInput = (string: string): FormattedLineInput =>
	normalizeWhiteSpace(string).trimStart() as FormattedLineInput;

export const formattedLine = (string: string): FormattedLine =>
	normalizeWhiteSpace(string).trim() as FormattedLine;

export const transliteratedLineInput = (
	string: string,
): TransliteratedLineInput =>
	normalizeWhiteSpace(onlyASCII(string)).trimStart() as TransliteratedLineInput;

export const transliteratedLine = (string: string): TransliteratedLine =>
	normalizeWhiteSpace(onlyASCII(string)).trim() as TransliteratedLine;

export const normalizedLineInput = (string: string): NormalizedLineInput =>
	normalizeWhiteSpace(
		onlyLowerCaseASCII(string),
	).trimStart() as NormalizedLineInput;

export const normalizedLine = (string: string): NormalizedLine =>
	normalizeWhiteSpace(onlyLowerCaseASCII(string)).trim() as NormalizedLine;

export const capitalized = (string: string) =>
	string.slice(0, 1).toUpperCase() + string.slice(1);

export const onlyASCII = (string: string) => deburr(string);

export const onlyLowerCaseASCII = (string: string) =>
	onlyASCII(string.toLowerCase());

const onlyLowerCaseAlphabeticalAndHyphen = (string: string, replacement = '') =>
	onlyLowerCaseASCII(string).replace(/[^a-z-]+/g, replacement);

export const onlyLowerCaseAlphabetical = (string: string, replacement = '') =>
	onlyLowerCaseASCII(string).replace(/[^a-z]+/g, replacement);

export const makeIndex = (data: string) => {
	const needles = onlyLowerCaseASCII(data).split(' ');
	return (query: string) => {
		const haystack = onlyLowerCaseASCII(query);
		return all(map((needle: string) => haystack.includes(needle), needles));
	};
};

export const firstNonNumericIndex = (string: string) =>
	string.search(/[^0123456789]/);

export const longestNumericPrefix = (string: string) =>
	string.slice(0, firstNonNumericIndex(string));

export function* yieldNumeric(iterable: Iterable<string>) {
	for (const item of iterable) {
		if (item >= '0' && item <= '9') {
			yield item;
		}
	}
}

export const onlyNumeric = (string: string) =>
	Array.from(yieldNumeric(string)).join('');

const patternsStatistics = (patterns: Iterable<string>) => {
	const minLength = min(increasing, map(len, patterns), 0);
	return {
		minLength,
	};
};

export const makeAnyIndex = (patterns: Iterable<string>) => {
	const needles = sorted(
		byLength(increasing),
		map(onlyLowerCaseASCII, patterns),
	);
	if (needles.length === 0) return null;
	const minLength = needles[0].length;
	return (query: string) => {
		if (query.length < minLength) return false;
		const haystack = onlyLowerCaseASCII(query);
		for (const needle of needles) {
			if (needle.length > haystack.length) return false;
			if (haystack.includes(needle)) return true;
		}

		return false;
	};
};

export const makeRegExpIndex = (patterns: Iterable<string>) => {
	const needles = list(map(onlyLowerCaseASCII, patterns));
	if (needles.length === 0) return null;
	const {minLength} = patternsStatistics(needles);
	const s = list(map(escapeStringRegexp, needles)).join('|');
	const re = new RegExp(s);
	return (query: string) => {
		if (query.length < minLength) return false;
		const haystack = onlyLowerCaseASCII(query);
		return re.test(haystack);
	};
};

const splitOn = function* (separator: RegExp, string: string) {
	assert(separator.flags === '');
	const re = new RegExp(separator.source, 'g');
	let lastIndex = 0;
	while (true) {
		const match = re.exec(string);
		if (match === null) break;
		// const [left, right] = match.indices[0];
		const left = match.index;
		const right = left + match[0]!.length;
		if (left !== lastIndex) {
			yield string.slice(lastIndex, left);
		}

		lastIndex = right;
	}

	if (lastIndex !== string.length) yield string.slice(lastIndex);
};

const split = (string: string, separator = /\s+/): string[] => [
	...splitOn(separator, string),
];

export const words = (string: string): string[] =>
	split(onlyLowerCaseAlphabetical(string, ' '));

export const names = (string: string): string[] =>
	split(onlyLowerCaseAlphabeticalAndHyphen(string, ' '));

const trigrams = (string: string): IterableIterator<string> =>
	map(([a, b, c]: [string, string, string]) => a + b + c, window(3, string));

const wrapTrigram = (x: string) => `0${x}0`;

export const stringTrigrams = (string: string) =>
	map(wrapTrigram, trigrams(onlyLowerCaseAlphabetical(string)));
const textTrigrams = (text: string) =>
	map(wrapTrigram, trigrams(`11${words(text).join('1')}1`));

const _junctionTrigram = (a: string, b: string) => {
	assert(a.length > 0);
	assert(b.length > 0);
	return `${a[a.length - 1]}1${b[0]}`;
};

const _junctionTrigrams = (left: string[], right: string[]) =>
	map(([a, b]) => _junctionTrigram(a, b), product([left, right]));

export const junctionTrigrams = (left: string[], right: string[]) =>
	map(wrapTrigram, _junctionTrigrams(left, right));

const _boundaryTrigrams = function* (
	strings: string[],
): IterableIterator<string> {
	for (const a of strings) {
		assert(a.length > 0);
		const wrapped = `11${a}1`;
		yield wrapped.slice(0, 3);
		yield wrapped.slice(1, 4);
		yield wrapped.slice(-3);
	}

	for (const [a, b] of combinations(strings, 2)) {
		yield _junctionTrigram(a, b);
	}
};

export const boundaryTrigrams = (strings: string[]) =>
	map(wrapTrigram, _boundaryTrigrams(strings));

export const normalizeSearch = (data: string) =>
	[...words(data), ...textTrigrams(data), ...stringTrigrams(data)].join(' ');

export const keepUnique = <T>(...iterables: Array<Iterable<T>>) => [
	...new Set<T>(_chain(iterables)),
];

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const _isPositiveIntegerStrict_regex = mem((base: number) => {
	assert(base >= 2 && base <= 36);
	const maxDigit = Math.min(base, 10) - 1;
	const alphaRange = base <= 10 ? '' : `a-${alphabet[base - 10 - 1]}`;
	const alphaRanges = alphaRange + alphaRange.toUpperCase();
	const limb = `[0-${maxDigit}${alphaRanges}]`;
	const nonZeroLimb = `[1-${maxDigit}${alphaRanges}]`;
	const regex = `^${nonZeroLimb}${limb}*$`;
	return new RegExp(regex);
});

const isZeroStrict = (string: string) => string === '0';

const isNonNegativeIntegerStrict = (string: string, base: number) => {
	if (base < 2 || base > 36) return false;
	if (isZeroStrict(string)) return true;
	const regex = _isPositiveIntegerStrict_regex(base);
	return regex.test(string);
};

const isPositiveIntegerStrict = (string: string, base: number) => {
	if (base < 2 || base > 36) return false;
	const regex = _isPositiveIntegerStrict_regex(base);
	return regex.test(string);
};

export const parseNonNegativeIntegerStrict = (string: string, base = 10) =>
	isNonNegativeIntegerStrict(string, base)
		? Number.parseInt(string, base)
		: Number.NaN;

export const parseNonNegativeIntegerStrictOrDefault = (
	string: string,
	base?: number,
	dflt?: any,
) => {
	const parsed = parseNonNegativeIntegerStrict(string, base);
	return Number.isNaN(parsed) ? dflt : parsed;
};

export const parseNonNegativeIntegerStrictOrString = (
	string: string,
	base?: number,
) => {
	return parseNonNegativeIntegerStrictOrDefault(string, base, string);
};

export const parseNonNegativeIntegerStrictOrUndefined = (
	string: string,
	base?: number,
) => {
	return parseNonNegativeIntegerStrictOrDefault(string, base, undefined);
};

export const parseNonNegativeIntegerStrictOrNull = (
	string: string,
	base?: number,
) => {
	return parseNonNegativeIntegerStrictOrDefault(string, base, null);
};

export const parsePositiveIntegerStrict = (string: string, base = 10) =>
	isPositiveIntegerStrict(string, base)
		? Number.parseInt(string, base)
		: Number.NaN;

export const parsePositiveIntegerStrictOrDefault = <T>(
	string: string,
	base?: number,
	dflt?: T,
) => {
	const parsed = parsePositiveIntegerStrict(string, base);
	return Number.isNaN(parsed) ? dflt : parsed;
};

export const parsePositiveIntegerStrictOrString = (
	string: string,
	base?: number,
) => {
	return parsePositiveIntegerStrictOrDefault(string, base, string);
};

export const parsePositiveIntegerStrictOrUndefined = (
	string: string,
	base?: number,
) => {
	return parsePositiveIntegerStrictOrDefault(string, base, undefined);
};

export const parsePositiveIntegerStrictOrNull = (
	string: string,
	base?: number,
) => {
	return parsePositiveIntegerStrictOrDefault(string, base, null);
};

export const parseUint32StrictOrString = (string: string, base?: number) => {
	const parsed = parseNonNegativeIntegerStrict(string, base);
	// eslint-disable-next-line no-bitwise
	return Number.isNaN(parsed) || (parsed >>> 0).toString() !== string
		? string
		: parsed;
};

export const containsNonAlphabetical = (string: string) =>
	/[^a-zA-Z :'-]/.test(onlyASCII(string));
