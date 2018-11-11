import React from 'react' ;
import PropTypes from 'prop-types';
import TagList from '../tags/TagList.js';

import AllergyCard from './AllergyCard.js';
import { Allergies } from '../../api/allergies.js';

export default function AllergiesList ( { match , page , perpage } ) {

  page = match && match.params.page && parseInt(match.params.page,10) || page ;

  return (
    <TagList
      page={page}
      perpage={perpage}
      collection={Allergies}
      Card={AllergyCard}
      subscription="allergies"
      root="/allergies"
    />
  ) ;

}

AllergiesList.defaultProps = {
  page: 0,
  perpage: 10,
} ;

AllergiesList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
} ;
