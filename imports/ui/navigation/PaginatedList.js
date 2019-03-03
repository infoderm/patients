import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const styles = theme => ({
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

function PaginatedLIst ( { classes, page , perpage , items , listItem, pageURL} ) {
  return (
    <div>
      <div>
        { items.map(listItem) }
      </div>
      { page === 0 ? null :
      <Fab className={classes.fabprev} color="primary" component={Link} to={pageURL(page-1)}>
          <NavigateBeforeIcon/>
      </Fab> }
      { items.length < perpage ? null :
      <Fab className={classes.fabnext} color="primary" component={Link} to={pageURL(page+1)}>
          <NavigateNextIcon/>
      </Fab> }
    </div>
  ) ;
}

PaginatedLIst.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
  pageURL: PropTypes.func.isRequired,
  listItem: PropTypes.func.isRequired,
  find: PropTypes.func.isRequired,
} ;

export default withTracker(({subscription, page, perpage, find}) => {
  Meteor.subscribe(subscription, page, perpage);
  return {
    page,
    perpage,
    items: find(page, perpage).fetch() ,
  } ;
}) ( withStyles(styles, { withTheme: true })(PaginatedLIst) );
