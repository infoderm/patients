import React from 'react' ;
import PropTypes from 'prop-types';

import Jumper from './Jumper.js';

export default function TabJumper ( { tabs , current , toURL } ) {

  const items = tabs.map(
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

TabJumper.propTypes = {
  tabs: PropTypes.array.isRequired,
  current: PropTypes.string,
  toURL: PropTypes.func.isRequired,
} ;
