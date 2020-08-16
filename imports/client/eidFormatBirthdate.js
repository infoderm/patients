import parseISO from 'date-fns/parseISO' ;
import isValid from 'date-fns/isValid' ;

import eidParseBirthdate from './eidParseBirthdate.js' ;

export default function eidFormatBirthdate ( string ) {
  const date = parseISO(string);
  if (isValid(date)) return date.toDateString();
  return string;
}
