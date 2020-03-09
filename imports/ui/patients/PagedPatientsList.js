import React, {Fragment} from 'react' ;

import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import Paginator from '../navigation/Paginator.js';

import PatientCard from './PatientCard.js';

export default function PagedPatientsList ( props ) {

  const { root , page , perpage , items } = props;

  return (
    <Fragment>
      <div>
        <Grid container spacing={3}>
          { items.map(patient => ( <PatientCard key={patient._id} patient={patient}/> )) }
        </Grid>
      </div>
      <Paginator page={page} end={items.length < perpage} root={root}/>
    </Fragment>
  ) ;

}

PagedPatientsList.propTypes = {
  root: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
};
