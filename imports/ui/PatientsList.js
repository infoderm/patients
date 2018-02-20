import React from 'react' ;

import { Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import FaceIcon from 'material-ui-icons/Face';

import PatientCard from './PatientCard.js';

const styles = theme => ({
  buttonTile: {
    minHeight: 200,
    width: '100%',
    fontSize: '1rem',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class PatientsList extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    const { patients , classes } = this.props;
    return (
      <Grid container spacing={24}>
        <Grid item sm={12} md={12} lg={6} xl={4}>
          <Button variant="raised" className={classes.buttonTile} component={Link} to="/new/patient">
            Add a new patient
            <FaceIcon className={classes.rightIcon}/>
          </Button>
        </Grid>
        { patients.map(patient => ( <PatientCard key={patient._id} patient={patient}/> )) }
      </Grid>
    ) ;
  }

}


PatientsList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true }) (PatientsList) ;
