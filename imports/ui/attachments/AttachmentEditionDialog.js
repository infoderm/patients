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

import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}) ;

class AttachmentEditionDialog extends React.Component {

  constructor ( props ) {
    super( props ) ;
    this.state = {
      filename: props.attachment.name || '',
      filenameError: '',
    };
  }

  render () {

    const { open , onClose , attachment , classes } = this.props ;
    const { filename , filenameError } = this.state ;

    const editThisAttachment = event => {
      event.preventDefault();
      if ( filename === '' ) {
	this.setState({filenameError: 'Filename cannot be empty'});
      }
      else {
	this.setState({filenameError: ''});
	Meteor.call('uploads.updateFilename', attachment._id, filename, (err, res) => {
	  if ( err ) console.error( err ) ;
	  else {
	    console.log(`Attachment ${attachment._id} changed name to ${filename}.`)
	    onClose();
	  }
	});
      }
    };

    return (
	<Dialog
	  open={open}
	  onClose={onClose}
	  component="form"
	  aria-labelledby="attachment-edition-dialog-title"
	>
	  <DialogTitle id="attachment-edition-dialog-title">Edit attachment {attachment.name}</DialogTitle>
	  <DialogContent>
	    <DialogContentText>
	      You can edit the attachment's file name.
	    </DialogContentText>
	    <TextField
	      autoFocus
	      margin="dense"
	      label="Filename"
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
	    <Button onClick={editThisAttachment} color="primary">
	      Save Changes
	      <SaveIcon className={classes.rightIcon}/>
	    </Button>
	  </DialogActions>
	</Dialog>
    );
  }

}

AttachmentEditionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  attachment: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
} ;

export default withStyles(styles)(AttachmentEditionDialog) ;
