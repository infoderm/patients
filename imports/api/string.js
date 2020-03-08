import deburr from 'lodash.deburr';

import { all } from '@aureooms/js-itertools' ;
import { map } from '@aureooms/js-itertools' ;

const normalized = string => {
  string = string.toLowerCase();
  string = string.trim();
  string = string.replace(/\s/g, ' ');
  string = deburr(string);
  return string ;
} ;

const onlyASCII = string => {
  string = deburr(string);
  return string ;
} ;

const onlyLowerCaseASCII = string => {
  string = string.toLowerCase();
  string = deburr(string);
  return string ;
} ;


const makeIndex = data => {
  const needles = onlyLowerCaseASCII(data).split(' ');
  return query => {
      const haystack = onlyLowerCaseASCII(query);
      return all(map(needle => haystack.includes(needle), needles));
  } ;
} ;

export {
  normalized ,
  onlyASCII ,
  onlyLowerCaseASCII ,
  makeIndex ,
} ;
