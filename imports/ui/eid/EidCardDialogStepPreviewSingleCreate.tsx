import assert from 'assert';
import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import Button from '@material-ui/core/Button';

import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import call from '../../api/endpoint/call';
import patientsInsert from '../../api/endpoint/patients/insert';
import {patients} from '../../api/patients';

import dialog from '../modal/dialog';
import ConfirmationDialog from '../modal/ConfirmationDialog';

import GenericStaticPatientCard from '../patients/GenericStaticPatientCard';

const EidCardDialogStepPreviewSingleCreate = ({
	onPrevStep,
	patientId,
	eidInfo,
	history,
	onClose,
}) => {
	assert(patientId === '?');
	const onNext = async () => {
		if (
			await dialog((resolve) => (
				<ConfirmationDialog
					title="Confirm"
					text="Confirm create operation."
					cancel="Cancel"
					confirm="Create a new patient"
					ConfirmIcon={PersonAddIcon}
					onCancel={() => {
						resolve(false);
					}}
					onConfirm={() => {
						resolve(true);
					}}
				/>
			))
		) {
			try {
				const _id = await call(patientsInsert, eidInfo);
				history.push({pathname: `/patient/${_id}`});
				onClose();
			} catch (error: unknown) {
				console.error(error);
			}
		}
	};

	const eidPatient = patients.sanitize(eidInfo);

	return (
		<>
			<DialogTitle>Review action</DialogTitle>
			<DialogContent>
				<DialogContentText>
					This is what the record will look like once created.
				</DialogContentText>
				<GenericStaticPatientCard patient={eidPatient} />
			</DialogContent>
			<DialogActions>
				<Button
					type="submit"
					startIcon={<SkipPreviousIcon />}
					onClick={onPrevStep}
				>
					Prev
				</Button>
				<Button color="primary" endIcon={<SkipNextIcon />} onClick={onNext}>
					Next
				</Button>
			</DialogActions>
		</>
	);
};

export default EidCardDialogStepPreviewSingleCreate;
