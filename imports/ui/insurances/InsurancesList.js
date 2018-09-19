import React from 'react' ;
import PropTypes from 'prop-types';
import TagList from '../tags/TagList.js';

import InsuranceCard from './InsuranceCard.js';
import { Insurances } from '../../api/insurances.js';

export default function InsurancesList ( { match , page , perpage } ) {

  page = match && match.params.page && parseInt(match.params.page,10) || page ;

  return (
    <TagList
      page={page}
      perpage={perpage}
      collection={Insurances}
      Card={InsuranceCard}
      subscription="insurances"
      root="/insurances"
    />
  ) ;

}

InsurancesList.defaultProps = {
  page: 0,
  perpage: 10,
} ;

InsurancesList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
} ;
