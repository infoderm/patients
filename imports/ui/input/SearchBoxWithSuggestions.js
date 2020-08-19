import React from 'react';
import PropTypes from 'prop-types';

import Downshift from 'downshift';

import SearchBoxWithSuggestionsInternals from './SearchBoxWithSuggestionsInternals.js';

export default function SearchBoxWithSuggestions ( props ) {

  const { filter , suggestions , itemToKey , itemToString , placeholder , className , ...rest } = props ;
  const internalsProps = { filter , suggestions , itemToKey , itemToString , placeholder , className } ;

  return (
    <Downshift itemToString={itemToString} {...rest}>
      {downshiftProps => ( <div><SearchBoxWithSuggestionsInternals {...downshiftProps} {...internalsProps}/></div> ) }
    </Downshift>
  );
}

SearchBoxWithSuggestions.defaultProps = {
  itemToString: x => x ? x : '',
  itemToKey: x => x,
} ;

SearchBoxWithSuggestions.propTypes = {
  suggestions: PropTypes.array.isRequired,
  filter: PropTypes.func.isRequired,
  itemToString: PropTypes.func.isRequired,
  itemToKey: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
} ;
