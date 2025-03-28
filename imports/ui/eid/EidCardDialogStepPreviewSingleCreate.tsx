import assert from 'assert';

import React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import {useSnackbar} from 'notistack';

import patientsInsertFromEid from '../../api/endpoint/patients/insertFromEid';
import {patientFieldsFromEid, patients} from '../../api/patients';

import useDialog from '../modal/useDialog';
import ConfirmationDialog from '../modal/ConfirmationDialog';

import GenericStaticPatientCard from '../patients/GenericStaticPatientCard';
import useCall from '../action/useCall';

import type EidCardDialogStepPreviewSingleProps from './EidCardDialogStepPreviewSingleProps';

const EidCardDialogStepPreviewSingleCreate = ({
	titleId,
	onPrevStep,
	patientId,
	eidInfo,
	navigate,
	onConfirm,
}: EidCardDialogStepPreviewSingleProps) => {
	assert(patientId === '?');
	const dialog = useDialog();
	const [call, {pending}] = useCall();
	const {enqueueSnackbar} = useSnackbar();

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
				const _id = await call(patientsInsertFromEid, eidInfo);
				navigate({pathname: `/patient/${_id}`});
				onConfirm();
			} catch (error: unknown) {
				console.error(error);
				enqueueSnackbar(
					`Inserting patient with eid info failed: ${
						error instanceof Error ? error.message : 'unknown'
					}.`,
					{variant: 'error'},
				);
			}
		}
	};

	const {$set} = patients.sanitize(patientFieldsFromEid(eidInfo));

	const eidPatient = {
		firstname: '',
		lastname: '',
		niss: '',
		birthdate: '',
		sex: '',
		photo: '',
		...$set,
	} as const;

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
				<Button
					disabled={pending}
					startIcon={<SkipPreviousIcon />}
					onClick={onPrevStep}
				>
					Prev
				</Button>
				<LoadingButton
					loading={pending}
					color="primary"
					endIcon={<SkipNextIcon />}
					loadingPosition="end"
					onClick={onNext}
				>
					Next
				</LoadingButton>
			</DialogActions>
		</>
	);
};

export default EidCardDialogStepPreviewSingleCreate;
