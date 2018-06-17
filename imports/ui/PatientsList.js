import React from 'react' ;

import { Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import FaceIcon from 'material-ui-icons/Face';
import NavigateBeforeIcon from 'material-ui-icons/NavigateBefore';
import NavigateNextIcon from 'material-ui-icons/NavigateNext';

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
  fabprev: {
      position: 'fixed',
      bottom: theme.spacing.unit * 3,
      right: theme.spacing.unit * 12,
  },
  fabnext: {
      position: 'fixed',
      bottom: theme.spacing.unit * 3,
      right: theme.spacing.unit * 3,
  },
});

class PatientsList extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    const { patients , classes , page , perpage } = this.props;
    return (
      <div>
        <Grid container spacing={24}>
          <Grid item sm={12} md={12} lg={6} xl={4}>
            <Button variant="raised" className={classes.buttonTile} component={Link} to="/new/patient">
              Add a new patient
              <FaceIcon className={classes.rightIcon}/>
            </Button>
          </Grid>
          { patients.slice(page*perpage, (page+1)*perpage).map(patient => ( <PatientCard key={patient._id} patient={patient}/> )) }
        </Grid>
        { page === 0 ? '' :
        <Button variant="fab" className={classes.fabprev} color="primary" component={Link} to={`/patients/page/${page-1}`}>
            <NavigateBeforeIcon/>
        </Button> }
        { page + 1 === Math.ceil(patients.length / perpage) ? '' :
        <Button variant="fab" className={classes.fabnext} color="primary" component={Link} to={`/patients/page/${page+1}`}>
            <NavigateNextIcon/>
        </Button> }
      </div>
    ) ;
  }

}


PatientsList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true }) (PatientsList) ;
