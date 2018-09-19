import React from 'react' ;

import { Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import ConsultationCard from './ConsultationCard.js';

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
      <Button variant="fab" className={classes.fabprev} color="primary" component={Link} to={`${root}/page/${page-1}`}>
      <NavigateBeforeIcon/>
      </Button> }
    { items.length < perpage ? '' :
        <Button variant="fab" className={classes.fabnext} color="primary" component={Link} to={`${root}/page/${page+1}`}>
        <NavigateNextIcon/>
        </Button> }
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
