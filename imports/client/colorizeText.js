import React from 'react';

import {enumerate} from '@aureooms/js-itertools';

import {onlyLowerCaseASCII} from '../api/string.js';

function* split(s) {
	const n = s.length;
	let word = '';
	for (let i = 0; i < n; ++i) {
		const c = s[i];
		switch (c) {
			case ' ':
			case '\t':
			case '\n':
				if (word !== '') {
					yield word;
					word = '';
				}

				yield c;
				break;
			default:
				word += c;
				break;
		}
	}

	if (word !== '') {
		yield word;
	}
}

export default function colorizeText(dict, text) {
	// O(m.n) algorithm
	// TODO replace by Aho-Corasick

	if (!text) {
		return [];
	}

	const needles = [];

	for (const word of dict) {
		const needle = onlyLowerCaseASCII(word);
		needles.push(needle);
	}

	const result = [];
	outer: for (const [i, piece] of enumerate(split(text))) {
		if (piece.length > 1) {
			const haystack = onlyLowerCaseASCII(piece);
			for (const needle of needles) {
				if (haystack.includes(needle)) {
					result.push(<mark key={i}>{piece}</mark>);
					continue outer;
				}
			}
		}

		result.push(piece);
	}

	return result;
}
