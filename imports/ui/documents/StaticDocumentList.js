import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import DocumentsPage from './DocumentsPage.js';

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

export default function StaticDocumentList ( { page , perpage , documents } ) {

  const classes = useStyles();

  return (
    <div>
      <DocumentsPage documents={documents}/>
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

StaticDocumentList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
  documents: PropTypes.array.isRequired,
} ;
