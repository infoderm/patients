import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import { Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { Doctors } from '../../api/doctors.js';

import DoctorCard from './DoctorCard.js';

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

class DoctorsList extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    const { doctors , classes , page , perpage } = this.props;
    return (
      <div>
        <Grid container spacing={24}>
          { doctors.map(doctor => ( <DoctorCard key={doctor._id} doctor={doctor}/> )) }
        </Grid>
        { page === 0 ? '' :
        <Button variant="fab" className={classes.fabprev} color="primary" component={Link} to={`/doctors/page/${page-1}`}>
            <NavigateBeforeIcon/>
        </Button> }
        { doctors.length < perpage ? '' :
        <Button variant="fab" className={classes.fabnext} color="primary" component={Link} to={`/doctors/page/${page+1}`}>
            <NavigateNextIcon/>
        </Button> }
      </div>
    ) ;
  }

}

DoctorsList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
};

export default withTracker(({page, perpage}) => {
  Meteor.subscribe('doctors');
  return {
    doctors: Doctors.find({}, {name: { $slice: [ page*perpage, perpage ] }}).fetch() ,
  } ;
}) ( withStyles(styles, { withTheme: true })(DoctorsList) );
