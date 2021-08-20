import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import {useHistory} from 'react-router-dom';

import {useSnackbar} from 'notistack';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import MergeTypeIcon from '@material-ui/icons/MergeType';
import CancelIcon from '@material-ui/icons/Cancel';

import withLazyOpening from '../modal/withLazyOpening';

const MergePatientsConfirmationDialog = (props) => {
	const {
		open,
		onClose,
		toCreate,
		consultationsToAttach,
		attachmentsToAttach,
		documentsToAttach,
		toDelete,
	} = props;

	const history = useHistory();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const mergePatients = (event) => {
		event.preventDefault();
		const key = enqueueSnackbar('Processing...', {variant: 'info'});
		Meteor.call(
			'patients.merge',
			toDelete,
			consultationsToAttach,
			attachmentsToAttach,
			documentsToAttach,
			toCreate,
			(err, _id) => {
				closeSnackbar(key);
				if (err) {
					console.error(err);
					enqueueSnackbar(err.message, {variant: 'error'});
				} else {
					const message = `Merged. Patient #${_id} created.`;
					console.log(message);
					enqueueSnackbar(message, {variant: 'success'});
					history.push({pathname: `/patient/${_id}`});
				}
			},
		);
	};

	return (
		<Dialog
			open={open}
			// component="form"
			aria-labelledby="merge-patients-confirmation-dialog-title"
			onClose={onClose}
		>
			<DialogTitle id="merge-patients-confirmation-dialog-title">
				Merge {toDelete.length} patients
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					<b>1 new patient</b> will be created,{' '}
					<b>{consultationsToAttach.length} consultations</b>,{' '}
					<b>{documentsToAttach.length} documents</b>, and{' '}
					<b>{attachmentsToAttach.length} attachments</b> will be attached to
					it, <b>{toDelete.length} patients will be deleted</b>. If you do not
					want to merge those patients, click cancel. If you really want to
					merge those patients, click the merge button.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					type="submit"
					color="default"
					endIcon={<CancelIcon />}
					onClick={onClose}
				>
					Cancel
				</Button>
				<Button
					color="secondary"
					endIcon={<MergeTypeIcon />}
					onClick={mergePatients}
				>
					Merge
				</Button>
			</DialogActions>
		</Dialog>
	);
};

MergePatientsConfirmationDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	toCreate: PropTypes.object.isRequired,
	consultationsToAttach: PropTypes.array.isRequired,
	attachmentsToAttach: PropTypes.array.isRequired,
	documentsToAttach: PropTypes.array.isRequired,
	toDelete: PropTypes.array.isRequired,
};

export default withLazyOpening(MergePatientsConfirmationDialog);
