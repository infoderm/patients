import assert from 'assert';
import deburr from 'lodash.deburr';
import escapeStringRegexp from 'escape-string-regexp';

import {all, map, sorted} from '@aureooms/js-itertools';
import {len, decreasing} from '@aureooms/js-compare';

const normalized = (string) => {
	string = string.toLowerCase();
	string = string.trim();
	string = string.replace(/\s/g, ' ');
	string = deburr(string);
	return string;
};

const onlyASCII = (string) => {
	string = deburr(string);
	return string;
};

const onlyLowerCaseASCII = (string) => {
	string = string.toLowerCase();
	string = deburr(string);
	return string;
};

const makeIndex = (data) => {
	const needles = onlyLowerCaseASCII(data).split(' ');
	return (query) => {
		const haystack = onlyLowerCaseASCII(query);
		return all(map((needle) => haystack.includes(needle), needles));
	};
};

const PARTICLES_FR = ['du', 'de', 'des', "d'", 'le', 'la'];
const PARTICLES_NL = [
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
const PARTICLES_DE = [
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

const PARTICLES = new Set([...PARTICLES_FR, ...PARTICLES_NL, ...PARTICLES_DE]);
const PARTICLES_ORDERED = sorted(len(decreasing), PARTICLES);

const words = (string) => string.trim().split(/\s+/);

function* splitParticles(data) {
	const queue = words(data).reverse();
	outer: while (queue.length !== 0) {
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

const normalizeSearch = (data) =>
	[...splitParticles(onlyLowerCaseASCII(data))].join(' ');

function* nonEmptySubstrings(string) {
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

const shatter = (data) => {
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

const _isPositiveIntegerStrict_regex = (base) => {
	assert(base >= 2 && base <= 36);
	const maxDigit = Math.min(base, 10) - 1;
	const alphaRange = base <= 10 ? '' : `a-${alphabet[base - 10 - 1]}`;
	const alphaRanges = alphaRange + alphaRange.toUpperCase();
	const limb = `[0-${maxDigit}${alphaRanges}]`;
	const nonZeroLimb = `[1-${maxDigit}${alphaRanges}]`;
	const regex = `^${nonZeroLimb}${limb}*$`;
	return new RegExp(regex);
};

const isZeroStrict = (string) => string === '0';

const isNonNegativeIntegerStrict = (string, base) => {
	if (base < 2 || base > 36) return false;
	if (isZeroStrict(string)) return true;
	const regex = _isPositiveIntegerStrict_regex(base);
	return regex.test(string);
};

const parseNonNegativeIntegerStrict = (string, base = 10) => {
	return isNonNegativeIntegerStrict(string, base)
		? Number.parseInt(string, base)
		: Number.NaN;
};

const parseNonNegativeIntegerStrictOrString = (string, base) => {
	const parsed = parseNonNegativeIntegerStrict(string, base);
	return Number.isNaN(parsed) ? string : parsed;
};

const parseUint32StrictOrString = (string, base) => {
	const parsed = parseNonNegativeIntegerStrict(string, base);
	return Number.isNaN(parsed) || (parsed >>> 0).toString() !== string
		? string
		: parsed;
};

export {
	normalized,
	onlyASCII,
	onlyLowerCaseASCII,
	makeIndex,
	shatter,
	normalizeSearch,
	escapeStringRegexp,
	parseNonNegativeIntegerStrict,
	parseNonNegativeIntegerStrictOrString,
	parseUint32StrictOrString
};
