import React from 'react' ;

import { Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import PatientCard from './PatientCard.js';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  fabprev: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(12),
  },
  fabnext: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
  },
});

function PagedPatientsList ( props ) {

  const { classes , root , page , perpage , items } = props;

  return (
    <div>
      <Grid container spacing={3}>
        { items.map(patient => ( <PatientCard key={patient._id} patient={patient}/> )) }
      </Grid>
      { page === 1 ? '' :
      <Fab className={classes.fabprev} color="primary" component={Link} to={`${root}/page/${page-1}`}>
        <NavigateBeforeIcon/>
      </Fab> }
      { items.length < perpage ? '' :
      <Fab className={classes.fabnext} color="primary" component={Link} to={`${root}/page/${page+1}`}>
        <NavigateNextIcon/>
      </Fab> }
    </div>
    ) ;
}

PagedPatientsList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  root: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
};

export default withStyles(styles, { withTheme: true }) (PagedPatientsList) ;
