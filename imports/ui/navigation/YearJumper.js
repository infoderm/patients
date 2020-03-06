import React from 'react' ;
import PropTypes from 'prop-types';

import { list } from '@aureooms/js-itertools' ;
import { range } from '@aureooms/js-itertools' ;

import Jumper from './Jumper.js';

export default function YearJumper ( { current , toURL } ) {

  const now = new Date();
  const thisyear = now.getFullYear();
  const end = Math.min(thisyear, current + 5) + 1;
  const begin = end - 11;

  const years = range(begin, end);
  const items = list(years).map(
    x => ({
      key: x,
      url: toURL(x),
      disabled: x === current,
    })
  );

  return (
      <Jumper items={items}/>
  ) ;

}

YearJumper.propTypes = {
  current: PropTypes.number.isRequired,
  toURL: PropTypes.func.isRequired,
} ;
