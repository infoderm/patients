import React, {Fragment} from 'react' ;

import { Link } from 'react-router-dom' ;

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles(
  theme => ({
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
  })
);

export default function Paginator ( { root , page , end } ) {

  const classes = useStyles();

  return (
    <Fragment>
    { page === 1 ? null :
      <Fab className={classes.fabprev} color="primary" component={Link} to={`${root}/page/${page-1}`}>
      <NavigateBeforeIcon/>
      </Fab> }
    { end ? null :
      <Fab className={classes.fabnext} color="primary" component={Link} to={`${root}/page/${page+1}`}>
      <NavigateNextIcon/>
      </Fab> }
    </Fragment>
  ) ;

}

Paginator.defaultProps = {
  end: false,
} ;

Paginator.propTypes = {
  page: PropTypes.number.isRequired,
  end: PropTypes.bool.isRequired,
  root: PropTypes.string.isRequired,
} ;
