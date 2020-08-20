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

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = (theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
});

class DocumentDeletionDialog extends React.Component {
	render() {
		const {open, onClose, document, classes} = this.props;

		const deleteThisDocument = (event) => {
			event.preventDefault();
			Meteor.call('documents.delete', document._id, (err, _res) => {
				if (err) {
					console.error(err);
				} else {
					console.log(`Document #${document._id} deleted.`);
					onClose();
				}
			});
		};

		return (
			<Dialog
				open={open}
				component="form"
				aria-labelledby="document-deletion-dialog-title"
				onClose={onClose}
			>
				<DialogTitle id="document-deletion-dialog-title">
					Delete document {document._id.toString()}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						If you do not want to delete this document, click cancel. If you
						really want to delete this document from the system, click the
						delete button.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button type="submit" color="default" onClick={onClose}>
						Cancel
						<CancelIcon className={classes.rightIcon} />
					</Button>
					<Button color="secondary" onClick={deleteThisDocument}>
						Delete
						<DeleteIcon className={classes.rightIcon} />
					</Button>
				</DialogActions>
			</Dialog>
		);
	}

	static propTypes = {
		open: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
		classes: PropTypes.object.isRequired
	};
}

export default withStyles(styles)(DocumentDeletionDialog);
