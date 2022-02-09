import assert from 'assert';
import React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

import Button from '@mui/material/Button';

import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import call from '../../api/endpoint/call';
import patientsInsert from '../../api/endpoint/patients/insert';
import {patients} from '../../api/patients';

import useDialog from '../modal/useDialog';
import ConfirmationDialog from '../modal/ConfirmationDialog';

import GenericStaticPatientCard from '../patients/GenericStaticPatientCard';
import EidCardDialogStepPreviewSingleProps from './EidCardDialogStepPreviewSingleProps';

const EidCardDialogStepPreviewSingleCreate = ({
	titleId,
	onPrevStep,
	patientId,
	eidInfo,
	navigate,
	onClose,
}: EidCardDialogStepPreviewSingleProps) => {
	assert(patientId === '?');
	const dialog = useDialog();
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
				navigate({pathname: `/patient/${_id}`});
				onClose();
			} catch (error: unknown) {
				console.error(error);
			}
		}
	};

	const eidPatient = patients.sanitize(eidInfo);

	return (
		<>
			<DialogTitle id={titleId}>Review action</DialogTitle>
			<DialogContent>
				<DialogContentText>
					This is what the record will look like once created.
				</DialogContentText>
				<GenericStaticPatientCard patient={eidPatient} />
			</DialogContent>
			<DialogActions>
				<Button startIcon={<SkipPreviousIcon />} onClick={onPrevStep}>
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
