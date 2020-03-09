import React, {Fragment} from 'react' ;

import { Link } from 'react-router-dom' ;

import PropTypes from 'prop-types';

import Prev from './Prev.js';
import Next from './Next.js';

export default function Paginator ( { root , page , end } ) {

  return (
    <Fragment>
      { page === 1 ? null : <Prev to={`${root}/page/${page-1}`}/> }
      { end ? null : <Next to={`${root}/page/${page+1}`}/> }
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
