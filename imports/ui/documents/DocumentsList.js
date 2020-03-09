import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Documents } from '../../api/documents.js' ;

import StaticDocumentList from './StaticDocumentList.js';

const DocumentsList = withTracker(({match, page, perpage}) => {
  page = (match && match.params.page && parseInt(match.params.page,10)) || page || DocumentsList.defaultProps.page ;
  perpage = perpage || DocumentsList.defaultProps.perpage ;
  const handle = Meteor.subscribe('documents');
  return {
    page,
    perpage,
    documents: !handle.ready() ? [] : Documents.find({}, {
      sort: { createdAt: -1 },
      skip: (page-1)*perpage,
      limit: perpage,
    }).fetch() ,
  } ;
}) ( StaticDocumentList );

DocumentsList.defaultProps = {
  page: 1,
  perpage: 10,
} ;

DocumentsList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
} ;

export default DocumentsList;
