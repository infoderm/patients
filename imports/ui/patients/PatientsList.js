import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Patients } from '../../api/patients.js' ;

import StaticPatientsList from './StaticPatientsList.js';

const PatientsList = withTracker(({match, page, perpage}) => {
  page = (match && match.params.page && parseInt(match.params.page,10)) || page || PatientsList.defaultProps.page ;
  perpage = perpage || PatientsList.defaultProps.perpage ;
  const sort = {
    lastname: 1,
  } ;
  const fields = {
  } ;
  const handle = Meteor.subscribe('patients', { sort , fields });
  const loading = !handle.ready();
  return {
    page,
    perpage,
    root: '/patients',
    loading,
    patients: loading ? [] : Patients.find({}, {
      sort,
      fields,
      skip: (page-1)*perpage,
      limit: perpage,
    }).fetch() ,
  } ;
}) ( StaticPatientsList );

PatientsList.defaultProps = {
  page: 1,
  perpage: 10,
} ;

PatientsList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
} ;

export default PatientsList;
