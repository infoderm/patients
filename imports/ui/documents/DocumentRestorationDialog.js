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

import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = (theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
});

class DocumentRestorationDialog extends React.Component {
	render() {
		const {open, onClose, document, classes} = this.props;

		const restoreThisDocument = (event) => {
			event.preventDefault();
			Meteor.call('documents.restore', document._id, (err, _res) => {
				if (err) {
					console.error(err);
				} else {
					console.log(`Document #${document._id} restored.`);
					onClose();
				}
			});
		};

		return (
			<Dialog
				open={open}
				component="form"
				aria-labelledby="document-restoration-dialog-title"
				onClose={onClose}
			>
				<DialogTitle id="document-restoration-dialog-title">
					Restore document {document._id.toString()}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						If you do not want to restore this document, click cancel. If you
						really want to restore this document from the system, click the
						restore button.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button type="submit" color="default" onClick={onClose}>
						Cancel
						<CancelIcon className={classes.rightIcon} />
					</Button>
					<Button color="primary" onClick={restoreThisDocument}>
						Restore
						<RestoreFromTrashIcon className={classes.rightIcon} />
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

DocumentRestorationDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DocumentRestorationDialog);
