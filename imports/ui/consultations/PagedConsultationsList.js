import React from 'react' ;

import { Link } from 'react-router-dom' ;

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

import ConsultationsList from './ConsultationsList.js';

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

export default function PagedConsultationsList ( props ) {

  const { root , loading , page , perpage , items , itemProps } = props;

  const classes = useStyles();

  return (
    <div>
      { loading ?
          <Loading/>
          : items.length ?
          <ConsultationsList items={items} itemProps={itemProps}/>
          :
          <NoContent>{`Nothing to see on page ${page}.`}</NoContent>
      }
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

PagedConsultationsList.defaultProps = {
  loading: false,
} ;

PagedConsultationsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  root: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
};
