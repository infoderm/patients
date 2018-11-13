import { Meteor } from 'meteor/meteor' ;

import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom' ;

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import MergeTypeIcon from '@material-ui/icons/MergeType';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
}) ;

class MergePatientsConfirmationDialog extends React.Component {

  render () {

    const { history , classes , open , onClose , toCreate , consultationsToAttach , toDelete } = this.props ;

    const mergePatients = event => {
      event.preventDefault();
      Meteor.call('patients.merge', toDelete , consultationsToAttach , toCreate, (err, _id) => {
	if ( err ) console.error( err ) ;
	else {
	  console.log(`Patient #${_id} created.`)
          history.push({pathname: `/patient/${_id}`}) ;
	}
      });
    };

    return (
	<Dialog
	  open={open}
	  onClose={onClose}
	  component="form"
	  aria-labelledby="merge-patients-confirmation-dialog-title"
	>
	  <DialogTitle id="merge-patients-confirmation-dialog-title">Merge {toDelete.length} patients</DialogTitle>
	  <DialogContent>
	    <DialogContentText>
	      <b>One new patient</b> will be
	      created, <b>{consultationsToAttach.length} consultations</b> and <b>{toCreate.attachments.length} attachments</b> will
	      be attached to it, <b>{toDelete.length} patients will be deleted</b>.
	      If you do not want to merge those patients, click cancel.
	      If you really want to merge those patients, click the merge button.
	    </DialogContentText>
	  </DialogContent>
	  <DialogActions>
	    <Button type="submit" onClick={onClose} color="default">
	      Cancel
	      <CancelIcon className={classes.rightIcon}/>
	    </Button>
	    <Button onClick={mergePatients} color="secondary">
	      Merge
	      <MergeTypeIcon className={classes.rightIcon}/>
	    </Button>
	  </DialogActions>
	</Dialog>
    );
  }

}

MergePatientsConfirmationDialog.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  toCreate: PropTypes.object.isRequired,
  consultationsToAttach: PropTypes.array.isRequired,
  toDelete: PropTypes.array.isRequired,
} ;

export default withStyles(styles)(withRouter(MergePatientsConfirmationDialog)) ;
