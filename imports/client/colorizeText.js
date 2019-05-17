import React from 'react';

import { onlyLowerCaseASCII } from '../api/string.js';

function escape ( s ) {
  // from https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function* split ( s ) {
  const n = s.length;
  let word = '';
  for ( let i = 0 ; i < n ; ++i ) {
    const c = s[i];
    switch (c) {
      case ' ':
      case '\t':
      case '\n':
        if ( word !== '' ) {
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
  if ( word !== '' ) {
    yield word;
  }
}

export default function colorizeText ( dict , text ) {

  // O(m.n) algorithm
  // TODO replace by Aho-Corasick

  if (!text) return [];

  const needles = [];

  for ( const word of dict ) {
    const needle = onlyLowerCaseASCII(word);
    needles.push(needle);
  }

  let result = [];
  outer: for ( const piece of split(text) ) {
    if (piece.length > 1) {
      const haystack = onlyLowerCaseASCII(piece);
      for ( const needle of needles ) {
        if (haystack.includes(needle)) {
          result.push(
            <mark>{piece}</mark>
          );
          continue outer;
        }
      }
    }
    switch (piece) {
      case '\n':
        result.push(<br/>);
        break;
      default:
        result.push(piece);
    }
  }

  return result;

}
