import assert from 'assert';
import deburr from 'lodash.deburr';

import {all, min} from '@iterable-iterator/reduce';
import {list} from '@iterable-iterator/list';
import {len} from '@functional-abstraction/operator';
import {map} from '@iterable-iterator/map';
import {sorted} from '@iterable-iterator/sorted';
import {increasing, decreasing} from '@total-order/primitive';
import {len as byLength} from '@total-order/key';
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

export const makeIndex = (data: string) => {
	const needles = onlyLowerCaseASCII(data).split(' ');
	return (query: string) => {
		const haystack = onlyLowerCaseASCII(query);
		return all(map((needle: string) => haystack.includes(needle), needles));
	};
};

export const firstNonNumericIndex = (string: string) => {
	return string.search(/[^0123456789]/);
};

export const longestNumericPrefix = (string: string) => {
	return string.slice(0, firstNonNumericIndex(string));
};

export function* yieldNumeric(iterable: Iterable<string>) {
	for (const item of iterable) {
		if (item >= '0' && item <= '9') {
			yield item;
		}
	}
}

export const onlyNumeric = (string: string) => {
	return Array.from(yieldNumeric(string)).join('');
};

const patternsStatistics = (patterns: Iterable<string>) => {
	const minLength = min(increasing, map(len, patterns), 0);
	return {
		minLength
	};
};

export const makeAnyIndex = (patterns: Iterable<string>) => {
	const needles = sorted(
		byLength(increasing),
		map(onlyLowerCaseASCII, patterns)
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

const PARTICLES_FR: string[] = ['du', 'de', 'des', "d'", 'le', 'la'];
const PARTICLES_NL: string[] = [
	'de',
	'den',
	'op',
	"t'",
	"'t",
	'ten',
	'ter',
	'te',
	'van',
	'der'
];
const PARTICLES_DE: string[] = [
	'am',
	'an',
	'af',
	'auf',
	'aus',
	'der',
	'im',
	'von',
	'und',
	'zu',
	'zum',
	'zur'
];

const PARTICLES: Set<string> = new Set([
	...PARTICLES_FR,
	...PARTICLES_NL,
	...PARTICLES_DE
]);
const PARTICLES_ORDERED: string[] = sorted(byLength(decreasing), PARTICLES);

const words = (string: string) => string.trim().split(/\s+/);

function* splitParticles(data: string) {
	const queue = words(data).reverse();
	outer: while (queue.length > 0) {
		const word = queue.pop();
		// greedy match
		// TODO use prefix tree
		for (const particle of PARTICLES_ORDERED) {
			if (word.startsWith(particle)) {
				yield particle;
				const rest = word.slice(particle.length);
				if (rest) queue.push(rest);
				continue outer;
			}
		}

		yield word;
	}
}

export const normalizeSearch = (data: string) =>
	[...splitParticles(onlyLowerCaseASCII(data))].join(' ');

function* nonEmptySubstrings(string: string) {
	const n = string.length;
	for (let i = 0; i < n; ++i) {
		for (let j = i + 1; j <= n; ++j) {
			yield string.slice(i, j);
		}
	}
}

const SHATTER_SHORT = 2;
const SHATTER_MEDIUM = 4;
const SHATTER_LONG = 6;

export const shatter = (data: string) => {
	const parts = splitParticles(onlyLowerCaseASCII(data));
	const index = {
		whole: [],
		particles: [],
		substring_long: [],
		substring_medium: [],
		substring_short: []
	};
	for (const part of parts) {
		if (PARTICLES.has(part)) {
			index.particles.push(part);
		} else {
			for (const _part of part.split(/[^a-z]+/)) {
				index.whole.push(_part);
				for (const substring of nonEmptySubstrings(_part)) {
					if (substring.length < SHATTER_SHORT) continue;
					else if (substring.length === _part.length) continue;
					else if (substring.length < SHATTER_MEDIUM)
						index.substring_short.push(substring);
					else if (substring.length < SHATTER_LONG)
						index.substring_medium.push(substring);
					else index.substring_long.push(substring);
				}
			}
		}
	}

	return index;
};

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

export const parseNonNegativeIntegerStrict = (string: string, base = 10) => {
	return isNonNegativeIntegerStrict(string, base)
		? Number.parseInt(string, base)
		: Number.NaN;
};

export const parseNonNegativeIntegerStrictOrString = (
	string: string,
	base?: number
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
