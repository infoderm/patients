import React from 'react';

import {enumerate} from '@iterable-iterator/zip';

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

/**
 * colorizeText.
 *
 * @param {Function} matches
 * @param {string} text
 */
export default function colorizeText(matches, text) {
	if (!text) return [];
	if (!matches) return [text];

	const result = [];
	for (const [i, piece] of enumerate(split(text))) {
		if (matches(piece)) {
			result.push(<mark key={i}>{piece}</mark>);
		} else {
			result.push(piece);
		}
	}

	return result;
}
