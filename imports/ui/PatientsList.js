import React from 'react' ;

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';

import Patient from './Patient.js';

const styles = theme => ({ });

class PatientsList extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    let { patients , filterSex } = this.props;
    if (filterSex != 'all') {
      patients = patients.filter(patient => patient.sex === filterSex);
    }
    return (
      <div style={{ padding: 12 }}>
      <Grid container spacing={24}>
      { patients.map(patient => ( <Patient key={patient._id} patient={patient}/> )) }
      </Grid>
      </div>
    ) ;
  }

}


PatientsList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true }) (PatientsList) ;
