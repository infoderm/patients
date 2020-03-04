import React from 'react' ;
import PropTypes from 'prop-types';

import { list } from '@aureooms/js-itertools' ;

import Jumper from './Jumper.js';

export default function AlphabetJumper ( { current , toURL } ) {

  const alphabet = 'abcdefghijklmnopqrstuvwxyz' ;
  const items = list(alphabet).map(
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

AlphabetJumper.propTypes = {
  current: PropTypes.string.isRequired,
  toURL: PropTypes.func.isRequired,
} ;
