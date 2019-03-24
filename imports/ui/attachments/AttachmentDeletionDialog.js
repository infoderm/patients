import { Meteor } from 'meteor/meteor' ;

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

import { normalized } from '../../api/string.js';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
}) ;

class AttachmentDeletionDialog extends React.Component {

  constructor ( props ) {
    super( props ) ;
    this.state = {
      filename: '',
      filenameError: '',
    };
  }

  render () {

    const { open , onClose , detach , itemId , attachment , classes } = this.props ;
    const { filename , filenameError } = this.state ;

    const trashAttachment = attachment => {
      Meteor.call('uploads.remove', attachment._id, err => {
	  if ( err ) console.error(`[Trash] Error during removal: ${err}`);
	  else console.log(`[Trash] File removed from DB and FS`);
      });
    }

    const deleteThisAttachmentIfLastNameMatches = event => {
      event.preventDefault();
      if ( normalized(filename) === normalized(attachment.name) ) {
	this.setState({filenameError: ''});
	Meteor.call(detach, itemId, attachment._id, (err, res) => {
	  if ( err ) console.error( err ) ;
	  else {
	    console.log(`[Detach] Attachment ${attachment.name} deleted with ${detach}(${itemId}).`)
	    onClose();
	    trashAttachment(attachment);
	  }
	});
      }
      else {
	this.setState({filenameError: 'Last names do not match'});
      }
    };

    return (
	<Dialog
	  open={open}
	  onClose={onClose}
	  component="form"
	  aria-labelledby="attachment-deletion-dialog-title"
	>
	  <DialogTitle id="attachment-deletion-dialog-title">Delete attachment {attachment.name}</DialogTitle>
	  <DialogContent>
	    <DialogContentText>
	      If you do not want to delete this attachment, click cancel.
	      If you really want to delete this attachment from the system, enter
	      its filename below and click the delete button.
	    </DialogContentText>
	    <TextField
	      autoFocus
	      margin="dense"
	      label="Attachment's filename"
	      fullWidth
	      value={filename}
	      onChange={e => this.setState({filename: e.target.value})}
	      helperText={filenameError}
	      error={!!filenameError}
	    />
	  </DialogContent>
	  <DialogActions>
	    <Button type="submit" onClick={onClose} color="default">
	      Cancel
	      <CancelIcon className={classes.rightIcon}/>
	    </Button>
	    <Button onClick={deleteThisAttachmentIfLastNameMatches} color="secondary">
	      Delete
	      <DeleteIcon className={classes.rightIcon}/>
	    </Button>
	  </DialogActions>
	</Dialog>
    );
  }

}

AttachmentDeletionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  detach: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  attachment: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
} ;

export default withStyles(styles)(AttachmentDeletionDialog) ;
