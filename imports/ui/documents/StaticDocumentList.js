import React, {Fragment} from 'react' ;
import PropTypes from 'prop-types';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';
import Paginator from '../navigation/Paginator.js' ;

import DocumentsPage from './DocumentsPage.js';

export default function StaticDocumentList ( { page , perpage , loading , documents , root } ) {

  return (
    <Fragment>
      <div>
        { loading ?
          <Loading/>
          : documents.length ?
          <DocumentsPage documents={documents}/>
          :
          <NoContent>{`Nothing to see on page ${page}.`}</NoContent>
        }
      </div>
      <Paginator page={page} end={documents.length < perpage} root={root}/>
    </Fragment>
  ) ;
}

StaticDocumentList.projection = DocumentsPage.projection ;

StaticDocumentList.defaultProps = {
  loading: false,
} ;

StaticDocumentList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  documents: PropTypes.array.isRequired,
  root: PropTypes.string.isRequired,
} ;
