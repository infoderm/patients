import React from 'react' ;

import PropTypes from 'prop-types' ;

import Grid from '@material-ui/core/Grid' ;

import PatientCard from './PatientCard.js' ;
import NewPatientCard from './NewPatientCard.js' ;

export default function PatientsPage ( { patients } ) {

  return (
      <div>
        <Grid container spacing={3}>
          <NewPatientCard/>
          { patients.map(patient => ( <PatientCard key={patient._id} patient={patient}/> )) }
        </Grid>
      </div>
  ) ;
}

PatientsPage.propTypes = {
  patients: PropTypes.array.isRequired,
} ;
