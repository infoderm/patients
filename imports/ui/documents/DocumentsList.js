import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { Documents } from '../../api/documents.js' ;

import DocumentListItem from './DocumentListItem.js';

const styles = theme => ({
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
});

function DocumentsList ( { classes, page , perpage , documents } ) {
  return (
    <div>
      <List>
        { documents.map(document => ( <DocumentListItem key={document._id} document={document}/> )) }
      </List>
      { page === 1 ? null :
      <Fab className={classes.fabprev} color="primary" component={Link} to={`/documents/page/${page-1}`}>
          <NavigateBeforeIcon/>
      </Fab> }
      { documents.length < perpage ? null :
      <Fab className={classes.fabnext} color="primary" component={Link} to={`/documents/page/${page+1}`}>
          <NavigateNextIcon/>
      </Fab> }
    </div>
  ) ;
}

DocumentsList.defaultProps = {
  page: 1,
  perpage: 10,
} ;

DocumentsList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
} ;

export default withTracker(({match, page, perpage}) => {
  page = (match && match.params.page && parseInt(match.params.page,10)) || page || DocumentsList.defaultProps.page ;
  perpage = perpage || DocumentsList.defaultProps.perpage ;
  const handle = Meteor.subscribe('documents');
  return {
    page,
    perpage,
    documents: !handle.ready() ? [] : Documents.find({}, {
      sort: { createdAt: -1 },
      skip: (page-1)*perpage,
      limit: perpage,
    }).fetch() ,
  } ;
}) ( withStyles(styles, { withTheme: true })(DocumentsList) );
