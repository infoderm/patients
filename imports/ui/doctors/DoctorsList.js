import React from 'react' ;
import PropTypes from 'prop-types';
import TagList from '../tags/TagList.js';

import DoctorCard from './DoctorCard.js';
import { Doctors } from '../../api/doctors.js';

import AlphabetJumper from '../navigation/AlphabetJumper.js';

export default function DoctorsList ( { match , prefix , page , perpage } ) {

  page = match && match.params.page && parseInt(match.params.page,10) || page ;
  prefix = match && match.params.prefix || prefix ;

  const name = prefix && new RegExp('^' + prefix, 'i') ;

  return (
    <div>
      <AlphabetJumper current={prefix} toURL={x => `/doctors/${x}`}/>
      <TagList
        page={page}
        perpage={perpage}
        collection={Doctors}
        Card={DoctorCard}
        subscription="doctors"
        url={match.url}
        name={name}
      />
    </div>
  ) ;

}

DoctorsList.defaultProps = {
  page: 1,
  perpage: 10,
} ;

DoctorsList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
  prefix: PropTypes.string,
} ;
