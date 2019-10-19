import { Meteor } from 'meteor/meteor' ;

import React from 'react';
import PropTypes from 'prop-types';

import startOfYear from 'date-fns/start_of_year';
import endOfYear from 'date-fns/end_of_year';
import dateFormat from 'date-fns/format' ;

import { saveAs } from 'file-saver';

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

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
}) ;

function download(filename, text) {

  const blob = new Blob(
    [text],
    {type: "text/plain;charset=utf-8"}
  ) ;

  saveAs(blob, filename);

}

class PatientDeletionDialog extends React.Component {

  constructor ( props ) {
    super( props ) ;
    const now = new Date();
    this.state = {
      year: dateFormat(now, 'YYYY'),
    };
  }

  downloadData = event => {
    event.preventDefault();
    const { onClose } = this.props ;
    const year = parseInt(this.state.year, 10) ;
    Meteor.call('books.year.csv', year, (err, res) => {
      if ( err ) console.error( err ) ;
      else {
	download(`carnets-${year}.csv`, res);
	onClose();
      }
    });
  };


  render () {

    const { open , onClose , classes } = this.props ;

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
	      value={this.state.year}
	      onChange={e => this.setState({year: e.target.value})}
	    />
	  </DialogContent>
	  <DialogActions>
	    <Button type="submit" onClick={onClose} color="default">
	      Cancel
	      <CancelIcon className={classes.rightIcon}/>
	    </Button>
	    <Button onClick={this.downloadData} color="primary">
	      Download
	      <SaveIcon className={classes.rightIcon}/>
	    </Button>
	  </DialogActions>
	</Dialog>
    );
  }

}

PatientDeletionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
} ;

export default withStyles(styles)(PatientDeletionDialog) ;
