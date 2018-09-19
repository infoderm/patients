import React from 'react' ;
import PropTypes from 'prop-types';
import TagList from '../tags/TagList.js';

import BookCard from './BookCard.js';
import { Books } from '../../api/books.js';

export default function BooksList ( { match , page , perpage } ) {

  page = match && match.params.page && parseInt(match.params.page,10) || page ;

  return (
    <TagList
      page={page}
      perpage={perpage}
      collection={Books}
      Card={BookCard}
      subscription="books"
      root="/books"
    />
  ) ;

}

BooksList.defaultProps = {
  page: 0,
  perpage: 10,
} ;

BooksList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
} ;
