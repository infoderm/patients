import React from 'react' ;

import { Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import ConsultationCard from './ConsultationCard.js';

const styles = theme => ({
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
  container: {
    padding: theme.spacing.unit * 3,
  },
});

function PagedConsultationsList ( props ) {

  const { classes , root , page , perpage , items } = props;

  return (
    <div>
    <div className={classes.container}>
    { items.map(consultation => ( <ConsultationCard key={consultation._id} consultation={consultation}/> )) }
    </div>
    { page === 0 ? '' :
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

PagedConsultationsList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  root: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
};

export default withStyles(styles, { withTheme: true }) (PagedConsultationsList) ;
