import { Meteor } from 'meteor/meteor' ;

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import startOfYear from 'date-fns/startOfYear';
import endOfYear from 'date-fns/endOfYear';
import dateFormat from 'date-fns/format' ;

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

import saveTextAs from '../../client/saveTextAs.js';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}) ;

function BooksDownloadDialog ( { classes, open, onClose, initialYear } ) {

  const [year, setYear] = useState(initialYear);

  useEffect(
    () => {
      setYear(initialYear);
    } ,
    [initialYear]
  ) ;

  const downloadData = event => {
    event.preventDefault();
    const _year = parseInt(year, 10) ;
    Meteor.call('books.year.csv', _year, (err, res) => {
      if ( err ) console.error( err ) ;
      else {
	saveTextAs(res, `carnets-${_year}.csv`);
	onClose();
      }
    });
  };

  return (
      <Dialog
	open={open}
	onClose={onClose}
	component="form"
	aria-labelledby="books-download-dialog-title"
      >
	<DialogTitle id="books-download-dialog-title">Download book data as CSV</DialogTitle>
	<DialogContent>
	  <DialogContentText>
	    Choose range then click download.
	  </DialogContentText>
	  <TextField
	    label="Year"
	    value={year}
	    onChange={e => setYear(e.target.value)}
	  />
	</DialogContent>
	<DialogActions>
	  <Button type="submit" onClick={onClose} color="default">
	    Cancel
	    <CancelIcon className={classes.rightIcon}/>
	  </Button>
	  <Button onClick={downloadData} color="primary">
	    Download
	    <SaveIcon className={classes.rightIcon}/>
	  </Button>
	</DialogActions>
      </Dialog>
  );

}

BooksDownloadDialog.defaultProps = {
    initialYear: dateFormat(new Date(), 'yyyy'),
} ;

BooksDownloadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  initialYear: PropTypes.string.isRequired,
} ;

export default withStyles(styles)(BooksDownloadDialog) ;
