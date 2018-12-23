const MILLISECOND = 1 ;
const SECOND = 1000 * MILLISECOND ;
const MINUTE = 60 * SECOND ;
const HOUR = 60 * MINUTE ;
const DAY = 24 * HOUR ;

const units = {
  day: DAY,
  hour: HOUR,
  minute: MINUTE,
  second: SECOND,
  millisecond: MILLISECOND,
} ;

const DEFAULT_UNITS = [
  [ 'day' , DAY ] ,
  [ 'hour' , HOUR ] ,
  [ 'minute' , MINUTE ] ,
  [ 'second' , SECOND ] ,
] ;

const DEFAULT_REST_UNIT = 'millisecond' ;

const DEFAULT_ABBR = {
  day: 'd',
  hour: 'h',
  minute: 'm',
  second: 's',
  millisecond: 'ms',
} ;

const DEFAULT_KEY_TO_STRING = (key, value, options) => options.verbose ? options.conjugate(key, value, options) : DEFAULT_ABBR[key] ;

const DEFAULT_VERBOSE = false ;

const DEFAULT_CONJUGATE = (key, value, options) => ' ' + key + (value > 1 ? 's' : '') ;

const DEFAULT_SEPARATOR = ' ' ;

const DEFAULT_OPTIONS = {
  units: DEFAULT_UNITS,
  restUnit: DEFAULT_REST_UNIT,
  keyToString: DEFAULT_KEY_TO_STRING,
  verbose: DEFAULT_VERBOSE,
  conjugate: DEFAULT_CONJUGATE,
  separator: DEFAULT_SEPARATOR,
} ;

function* quantityToDigits ( units , restUnit , quantity ) {

  let rest = quantity ;

  for ( const [ key , size ] of units ) {
    const howManyOfKey = (rest / size) | 0 ;
    if ( howManyOfKey > 0 ) {
      yield [ key , howManyOfKey ] ;
      rest -= howManyOfKey * size ;
    }
  }

  if ( rest === quantity || rest > 0 ) yield [ restUnit , rest ] ;

}

function* msToParts ( ms , options ) {

  const digits = quantityToDigits(options.units, options.restUnit, ms);
  const keyToString = options.keyToString;

  for ( const [ key , value ] of digits ) {
    yield `${value}${keyToString(key, value, options)}`;
  }

}

function msToString ( dirtyMs , dirtyOptions ) {
  const options = Object.assign({}, DEFAULT_OPTIONS, dirtyOptions);
  const ms = dirtyMs;
  return [ ...msToParts(ms, options)].join(options.separator);
}

export {
  msToString ,
  units ,
}
