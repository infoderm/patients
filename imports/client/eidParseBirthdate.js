import parseISO from 'date-fns/parseISO' ;
import isValid from 'date-fns/isValid' ;

function* candidates ( string ) {
  yield parseISO( string ) ;
  yield parseISO( string.slice(0,7) ) ;
  yield parseISO( string.slice(0,4) ) ;
  yield parseISO( '1970-01-01' ) ;
}

export default function eidParseBirthdate ( string ) {
  for ( const date of candidates(string) ) {
    if (isValid(date)) return date;
  }
  return new Date();
}
