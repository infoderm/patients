import React from 'react' ;
import PropTypes from 'prop-types';

import { list } from '@aureooms/js-itertools' ;
import { range } from '@aureooms/js-itertools' ;

import TabJumper from './TabJumper.js';

export default function YearJumper ( { current , ...rest } ) {

  const now = new Date();
  const thisyear = now.getFullYear();
  const end = Math.min(thisyear, current + 5) + 1;
  const begin = end - 11;

  const years = range(begin, end);
  const tabs = list(years);

  return (
      <TabJumper tabs={tabs} current={current} {...rest}/>
  ) ;

}

YearJumper.propTypes = {
  current: PropTypes.number.isRequired,
} ;
