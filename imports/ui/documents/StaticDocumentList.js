import React, {Fragment} from 'react' ;
import PropTypes from 'prop-types';

import Paginator from '../navigation/Paginator.js' ;

import DocumentsPage from './DocumentsPage.js';

export default function StaticDocumentList ( { page , perpage , documents } ) {

  return (
    <Fragment>
      <div>
        <DocumentsPage documents={documents}/>
      </div>
      <Paginator page={page} end={documents.length < perpage} root="/documents"/>
    </Fragment>
  ) ;
}

StaticDocumentList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
  documents: PropTypes.array.isRequired,
} ;
