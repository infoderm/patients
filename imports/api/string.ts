import assert from 'assert';
import deburr from 'lodash.deburr';

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
import escapeStringRegexp from 'escape-string-regexp';

export {default as escapeStringRegexp} from 'escape-string-regexp';

export const normalizeWhiteSpace = (string: string) =>
	string.replace(/\s+/g, ' ');

export const normalizeInput = (string: string) =>
	normalizeWhiteSpace(onlyLowerCaseASCII(string));

export const normalized = (string: string) => normalizeInput(string).trim();

export const capitalized = (string: string) =>
	string[0].toUpperCase() + string.slice(1);

export const onlyASCII = (string: string) => deburr(string);

export const onlyLowerCaseASCII = (string: string) =>
	onlyASCII(string.toLowerCase());

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

const split = (string: string): string[] => {
	const trimmed = string.replace(/^\s+/, '').replace(/\s+$/, '');
	return trimmed === '' ? [] : trimmed.split(/\s+/);
};

export const words = (string: string): string[] =>
	split(onlyLowerCaseAlphabetical(string, ' '));

const trigrams = (string: string): IterableIterator<string> =>
	map(([a, b, c]: string[]) => a + b + c, window(3, string));

const wrapTrigram = (x: string) => `0${x}0`;

export const stringTrigrams = (string: string) =>
	map(wrapTrigram, trigrams(onlyLowerCaseAlphabetical(string)));
const textTrigrams = (text: string) =>
	map(wrapTrigram, trigrams(`11${words(text).join('1')}1`));

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
		yield `${a[a.length - 1]}1${b[0]}`;
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

const _isPositiveIntegerStrict_regex = (base: number) => {
	assert(base >= 2 && base <= 36);
	const maxDigit = Math.min(base, 10) - 1;
	const alphaRange = base <= 10 ? '' : `a-${alphabet[base - 10 - 1]}`;
	const alphaRanges = alphaRange + alphaRange.toUpperCase();
	const limb = `[0-${maxDigit}${alphaRanges}]`;
	const nonZeroLimb = `[1-${maxDigit}${alphaRanges}]`;
	const regex = `^${nonZeroLimb}${limb}*$`;
	return new RegExp(regex);
};

const isZeroStrict = (string: string) => string === '0';

const isNonNegativeIntegerStrict = (string: string, base: number) => {
	if (base < 2 || base > 36) return false;
	if (isZeroStrict(string)) return true;
	const regex = _isPositiveIntegerStrict_regex(base);
	return regex.test(string);
};

export const parseNonNegativeIntegerStrict = (string: string, base = 10) =>
	isNonNegativeIntegerStrict(string, base)
		? Number.parseInt(string, base)
		: Number.NaN;

export const parseNonNegativeIntegerStrictOrString = (
	string: string,
	base?: number,
) => {
	const parsed = parseNonNegativeIntegerStrict(string, base);
	return Number.isNaN(parsed) ? string : parsed;
};

export const parseUint32StrictOrString = (string: string, base?: number) => {
	const parsed = parseNonNegativeIntegerStrict(string, base);
	return Number.isNaN(parsed) || (parsed >>> 0).toString() !== string
		? string
		: parsed;
};

export const containsNonAlphabetical = (string: string) =>
	/[^a-zA-Z :'-]/.test(onlyASCII(string));
