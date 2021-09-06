import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import LinkOffIcon from '@material-ui/icons/LinkOff';
import CancelIcon from '@material-ui/icons/Cancel';

import withLazyOpening from '../modal/withLazyOpening';
import call from '../../api/endpoint/call';
import unlink from '../../api/endpoint/documents/unlink';

const DocumentUnlinkingDialog = (props) => {
	const {open, onClose, document} = props;

	const unlinkThisDocument = async (event) => {
		event.preventDefault();
		try {
			await call(unlink, document._id);
			console.log(`Document #${document._id} unlinked.`);
			onClose();
		} catch (error: unknown) {
			console.error(error);
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Unlink document {document._id.toString()}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					If you do not want to unlink this document, click cancel. If you
					really want to unlink this document from its patient, click the unlink
					button.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button color="default" endIcon={<CancelIcon />} onClick={onClose}>
					Cancel
				</Button>
				<Button
					color="secondary"
					endIcon={<LinkOffIcon />}
					onClick={unlinkThisDocument}
				>
					Unlink
				</Button>
			</DialogActions>
		</Dialog>
	);
};

DocumentUnlinkingDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default withLazyOpening(DocumentUnlinkingDialog);
