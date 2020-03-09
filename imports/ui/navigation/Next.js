import React from 'react' ;

import { Link } from 'react-router-dom' ;

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles(
  theme => ({
    fabnext: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
    },
  })
);

export default function Next ( { to } ) {

  const classes = useStyles();

  return (
    <Fab className={classes.fabnext} color="primary" component={Link} to={to}>
      <NavigateNextIcon/>
    </Fab>
  ) ;

}

Next.propTypes = {
  to: PropTypes.string.isRequired,
} ;
