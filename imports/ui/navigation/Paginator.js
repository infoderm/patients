import React, {Fragment} from 'react' ;

import { Link } from 'react-router-dom' ;

import PropTypes from 'prop-types';

import Prev from './Prev.js';
import Next from './Next.js';

export default function Paginator ( { root , page , end } ) {

  if (page === 1 && end) return null ;

  return (
    <Fragment>
      <Prev to={`${root}/page/${page-1}`} disabled={page === 1}/>
      <Next to={`${root}/page/${page+1}`} disabled={end}/>
    </Fragment>
  ) ;

}

Paginator.defaultProps = {
  end: false,
} ;

Paginator.propTypes = {
  page: PropTypes.number.isRequired,
  end: PropTypes.bool.isRequired,
  root: PropTypes.string.isRequired,
} ;
