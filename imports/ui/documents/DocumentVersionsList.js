import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Documents } from '../../api/documents.js' ;

import StaticDocumentList from './StaticDocumentList.js';

const DocumentsVersionsList = withTracker(({match, page, perpage}) => {
  page = (match && match.params.page && parseInt(match.params.page,10)) || page || DocumentsVersionsList.defaultProps.page ;
  perpage = perpage || DocumentsVersionsList.defaultProps.perpage ;
  const {identifier, reference} = match.params ;
  const sort = { datetime: -1 } ;
  const handle = Meteor.subscribe('documents.versions', identifier, reference, { sort });
  return {
    page,
    perpage,
    documents: !handle.ready() ? [] : Documents.find({
      identifier,
      reference,
    }, {
      sort,
      skip: (page-1)*perpage,
      limit: perpage,
    }).fetch() ,
  } ;
}) ( StaticDocumentList );

DocumentsVersionsList.defaultProps = {
  page: 1,
  perpage: 10,
} ;

DocumentsVersionsList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
} ;

export default DocumentsVersionsList;
