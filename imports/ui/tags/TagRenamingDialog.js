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

import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';

import { normalized } from '../../api/string.js';
import MeteorSimpleAutoCompleteTextField from '../input/MeteorSimpleAutoCompleteTextField.js';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}) ;

const MAGIC = "8324jdkf-tag-renaming-dialog-title" ;
let nextAriaId = 0 ;

class TagRenamingDialog extends React.Component {

  constructor ( props ) {
    super( props ) ;
    this.state = {
      oldname: '',
      oldnameError: '',
      newname: '',
      newnameError: '',
      ariaId: `${MAGIC}-#${++nextAriaId}` ,
    };
  }

  render () {

    const { classes, open, onClose, onRename, title, collection, subscription, method, tag } = this.props ;
    const { oldname , oldnameError , newname , newnameError , ariaId } = this.state ;

    const Title = title[0].toUpperCase() + title.slice(1) ;

    const renameThisTagIfNameMatchesAndNewNameNotEmpty = event => {
      event.preventDefault();
      let error = false;
      if ( normalized(oldname) !== normalized(tag.name) ) {
	this.setState({oldnameError: 'Names do not match'});
	error = true;
      }
      else this.setState({oldnameError: ''});

      const name = newname.trim();
      if ( name.length === 0 ) {
	this.setState({newnameError: 'The new name is empty'});
	error = true;
      }
      else this.setState({newnameError: ''});

      if ( !error ) {
	Meteor.call(method, tag._id, name, (err, res) => {
	  if ( err ) console.error( err ) ;
	  else {
	    console.log(`${Title} #${tag._id} rename from ${oldname} to ${name} (using ${method}).`)
	    onRename(name);
	  }
	});
      }

    };

    return (
	<Dialog
	  open={open}
	  onClose={onClose}
	  component="form"
	  aria-labelledby={ariaId}
	>
	  <DialogTitle id={ariaId}>Rename {title} {tag.name}</DialogTitle>
	  <DialogContent>
	    <DialogContentText>
	      If you do not want to rename this {title}, click cancel.
	      If you really want to rename this {title} from the system, enter
	      the {title}'s old name and new name below and click the rename button.
	    </DialogContentText>
	    <TextField
	      autoFocus
	      margin="dense"
	      label={`${Title}'s old name`}
	      fullWidth
	      value={oldname}
	      onChange={e => this.setState({oldname: e.target.value})}
	      helperText={oldnameError}
	      error={!!oldnameError}
	    />
	    <MeteorSimpleAutoCompleteTextField
	      subscription={subscription}
	      collection={collection}
	      selector={{name: { $ne: tag.name}}}
	      stringify={tag => tag.name}
	      textFieldProps={{
		margin: "dense",
		label: `${Title}'s new name`,
		fullWidth: true,
		value: newname,
		onChange: e => this.setState({newname: e.target.value}),
		helperText: newnameError,
		error: !!newnameError,
	      }}
	    />
	  </DialogContent>
	  <DialogActions>
	    <Button type="submit" onClick={onClose} color="default">
	      Cancel
	      <CancelIcon className={classes.rightIcon}/>
	    </Button>
	    <Button onClick={renameThisTagIfNameMatchesAndNewNameNotEmpty} color="secondary">
	      Rename
	      <EditIcon className={classes.rightIcon}/>
	    </Button>
	  </DialogActions>
	</Dialog>
    );
  }

}

TagRenamingDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  collection: PropTypes.object.isRequired,
  subscription: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  tag: PropTypes.object.isRequired,
} ;

export default withStyles(styles)(TagRenamingDialog) ;
