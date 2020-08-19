import React from 'react' ;

import NoContent from './NoContent.js' ;

import startOfDay from 'date-fns/startOfDay' ;
import addHours from 'date-fns/addHours' ;
import isAfter from 'date-fns/isAfter' ;

import { TIME_BREAK , TIME_EVENING } from '../../client/constants.js' ;

export default function Greetings ( ) {
  const now = new Date();
  const today = startOfDay(now);
  const noon = addHours(today, TIME_BREAK);
  const evening = addHours(today, TIME_EVENING);
  let greeting = 'Bonjour' ;
  if ( isAfter(now, evening) ) greeting = 'Bonsoir' ;
  else if ( isAfter(now, noon) ) greeting = 'Good afternoon' ;
  return <NoContent>{greeting} maman!</NoContent> ;
}
