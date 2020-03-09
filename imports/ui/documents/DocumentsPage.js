import React from 'react' ;
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';

import DocumentListItem from './DocumentListItem.js';

export default function DocumentsPage ( { documents } ) {

  return (
    <List>
      { documents.map(document => ( <DocumentListItem key={document._id} document={document}/> )) }
    </List>
  ) ;
}

DocumentsPage.propTypes = {
  documents: PropTypes.array.isRequired,
} ;
