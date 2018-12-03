import { Meteor } from 'meteor/meteor' ;

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
}) ;

class HLTReportDeletionDialog extends React.Component {

  constructor ( props ) {
    super( props ) ;
  }

  render () {

    const { open , onClose , report, classes } = this.props ;

    const deleteThisHLTReport = event => {
      event.preventDefault();
      Meteor.call('hlt-reports.remove', report._id, (err, res) => {
	if ( err ) console.error( err ) ;
	else {
	  console.log(`HLT report #${report._id} deleted.`)
	  onClose();
	}
      });
    };

    return (
	<Dialog
	  open={open}
	  onClose={onClose}
	  component="form"
	  aria-labelledby="hlt-report-deletion-dialog-title"
	>
	  <DialogTitle id="hlt-report-deletion-dialog-title">Delete HLT report {report._id}</DialogTitle>
	  <DialogContent>
	    <DialogContentText>
	      If you do not want to delete this HLT report, click cancel.
	      If you really want to delete this HLT report from the system, click the delete button.
	    </DialogContentText>
	  </DialogContent>
	  <DialogActions>
	    <Button type="submit" onClick={onClose} color="default">
	      Cancel
	      <CancelIcon className={classes.rightIcon}/>
	    </Button>
	    <Button onClick={deleteThisHLTReport} color="secondary">
	      Delete
	      <DeleteIcon className={classes.rightIcon}/>
	    </Button>
	  </DialogActions>
	</Dialog>
    );
  }

}

HLTReportDeletionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
} ;

export default withStyles(styles)(HLTReportDeletionDialog) ;
