import React from 'react' ;
import PropTypes from 'prop-types';
import TagList from '../tags/TagList.js';

import DoctorCard from './DoctorCard.js';
import { Doctors } from '../../api/doctors.js';

export default function DoctorsList ( { match , page , perpage } ) {

  page = match && match.params.page && parseInt(match.params.page,10) || page ;

  return (
    <TagList
      page={page}
      perpage={perpage}
      collection={Doctors}
      Card={DoctorCard}
      subscription="doctors"
      root="/doctors"
    />
  ) ;

}

DoctorsList.defaultProps = {
  page: 0,
  perpage: 10,
} ;

DoctorsList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
} ;
