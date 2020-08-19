import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { myDecodeURIComponent } from '../../client/uri.js';

import { Patients } from '../../api/patients.js' ;

import StaticPatientsList from './StaticPatientsList.js';

const PatientsSearchResults = withTracker(({match, page, perpage, ...rest}) => {
  page = (match && match.params.page && parseInt(match.params.page,10)) || page || PatientsSearchResults.defaultProps.page ;
  perpage = perpage || PatientsSearchResults.defaultProps.perpage ;
  const sort = {
    score: { $meta: "textScore" }
  } ;
  const fields = {
    score: { $meta: "textScore" } ,
    ...StaticPatientsList.projection ,
  } ;
  const query = { $text : { $search : myDecodeURIComponent(match.params.query) } } ;
  const handle = Meteor.subscribe('patients', query, { sort , fields });
  const loading = !handle.ready();
  return {
    page,
    perpage,
    root: `/search/${match.params.query}`,
    loading,
    patients: loading ? [] : Patients.find({}, {
      sort,
      fields: StaticPatientsList.projection,
      skip: (page-1)*perpage,
      limit: perpage,
    }).fetch() ,
    ...rest
  } ;
}) ( StaticPatientsList );

PatientsSearchResults.defaultProps = {
  page: 1,
  perpage: 10,
} ;

PatientsSearchResults.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
} ;

export default PatientsSearchResults;
