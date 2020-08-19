import React from 'react' ;
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FaceIcon from '@material-ui/icons/Face';

import PatientCard from './PatientCard.js';

const useStyles = makeStyles(
  theme => ({
    buttonTile: {
      minHeight: 200,
      width: '100%',
      fontSize: '1rem',
    },
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
  })
);

export default function PatientsPage ( { patients } ) {

  const classes = useStyles() ;

  return (
      <div>
        <Grid container spacing={3}>
          <Grid item sm={12} md={12} lg={6} xl={4}>
            <Button variant="contained" className={classes.buttonTile} component={Link} to="/new/patient">
              Add a new patient
              <FaceIcon className={classes.rightIcon}/>
            </Button>
          </Grid>
          { patients.map(patient => ( <PatientCard key={patient._id} patient={patient}/> )) }
        </Grid>
      </div>
  ) ;
}

PatientsPage.propTypes = {
  patients: PropTypes.array.isRequired,
} ;
