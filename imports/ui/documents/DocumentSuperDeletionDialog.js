import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '../modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = (theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
});

class DocumentDeletionDialog extends React.Component {
	render() {
		const {open, onClose, document, classes} = this.props;

		const deleteThisDocumentForever = (event) => {
			event.preventDefault();
			Meteor.call('documents.superdelete', document._id, (err, _res) => {
				if (err) {
					console.error(err);
				} else {
					console.log(`Document #${document._id} deleted forever.`);
					onClose();
				}
			});
		};

		return (
			<Dialog
				open={open}
				component="form"
				aria-labelledby="document-super-deletion-dialog-title"
				onClose={onClose}
			>
				<DialogTitle id="document-super-deletion-dialog-title">
					Delete document {document._id.toString()} forever
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						If you do not want to delete this document forever, click cancel. If
						you really want to delete this document from the system forever,
						click the delete button.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button type="submit" color="default" onClick={onClose}>
						Cancel
						<CancelIcon className={classes.rightIcon} />
					</Button>
					<Button color="secondary" onClick={deleteThisDocumentForever}>
						Delete forever
						<DeleteForeverIcon className={classes.rightIcon} />
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

DocumentDeletionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DocumentDeletionDialog);
