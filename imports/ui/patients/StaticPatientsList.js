import React, {Fragment} from 'react' ;
import PropTypes from 'prop-types';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';
import Paginator from '../navigation/Paginator.js' ;

import PatientsPage from './PatientsPage.js';

export default function StaticPatientsList ( { page , perpage , loading , patients , root } ) {

  return (
    <Fragment>
      <div>
        { loading ?
          <Loading/>
          : patients.length ?
          <PatientsPage patients={patients}/>
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
