import React, {Fragment} from 'react' ;
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid' ;

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';
import Paginator from '../navigation/Paginator.js' ;

import PatientsPage from './PatientsPage.js';
import NewPatientCard from './NewPatientCard.js' ;

export default function StaticPatientsList ( { page , perpage , loading , patients , root , ...rest } ) {

  return (
    <Fragment>
      <div {...rest}>
        { loading ?
          <Loading/>
          : patients.length ?
          <PatientsPage patients={patients}/>
          : page === 1 ?
          <div>
            <NoContent>No patients match the current query.</NoContent>
            <Grid container spacing={3}>
              <Grid item sm="auto" md="auto" lg={3} xl={4}/>
              <NewPatientCard/>
              <Grid item sm="auto" md="auto" lg={3} xl={4}/>
            </Grid>
          </div>
          :
          <NoContent>{`Nothing to see on page ${page}.`}</NoContent>
        }
      </div>
      <Paginator page={page} end={patients.length < perpage} root={root}/>
    </Fragment>
  ) ;
}

StaticPatientsList.defaultProps = {
  loading: false,
} ;

StaticPatientsList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  patients: PropTypes.array.isRequired,
  root: PropTypes.string.isRequired,
} ;
