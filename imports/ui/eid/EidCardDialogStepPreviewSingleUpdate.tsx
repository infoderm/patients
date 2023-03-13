import assert from 'assert';
import React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

import LinearProgress from '@mui/material/LinearProgress';

import Typography from '@mui/material/Typography';

import Grid from '@mui/material/Grid';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Button from '@mui/material/Button';

import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

import {red, green} from '@mui/material/colors';

import LoadingButton from '@mui/lab/LoadingButton';
import diff from '../../lib/lcs/diff';
import pngDataURL from '../../lib/png/dataURL';

import patientsUpdate from '../../api/endpoint/patients/update';
import {patients} from '../../api/patients';

import useDialog from '../modal/useDialog';
import ConfirmationDialog from '../modal/ConfirmationDialog';

import GenericStaticPatientCard from '../patients/GenericStaticPatientCard';
import ReactivePatientCard from '../patients/ReactivePatientCard';
import PatientsGrid from '../patients/PatientsGrid';
import usePatient from '../patients/usePatient';

import useCall from '../action/useCall';
import type EidCardDialogStepPreviewSingleProps from './EidCardDialogStepPreviewSingleProps';

const computeDifferences = function* (state, changes) {
	for (const key of Object.keys(changes)) {
		if (changes[key] === undefined) continue;
		if (state[key] !== changes[key]) yield key;
	}
};

const renderDiff = function* (parts) {
	let key = 0;
	for (const [type, value] of parts) {
		switch (type) {
			case -1: {
				yield (
					<span
						key={++key}
						style={{
							backgroundColor: red[200],
						}}
					>
						{value}
					</span>
				);
				break;
			}

			case 1: {
				yield (
					<span
						key={++key}
						style={{
							backgroundColor: green[200],
						}}
					>
						{value}
					</span>
				);
				break;
			}

			default: {
				assert(type === 0);
				yield <span key={++key}>{value}</span>;
				break;
			}
		}
	}
};

const TextDifference = ({field, oldValue, newValue}) => {
	const diffParts = diff(oldValue ?? '', newValue ?? '');
	const diffLeft = Array.from(
		renderDiff(diffParts.filter(([type]) => type !== 1)),
	);
	const diffRight = Array.from(
		renderDiff(diffParts.filter(([type]) => type !== -1)),
	);
	return (
		<TableRow>
			<TableCell component="th" scope="row">
				{field}
			</TableCell>
			<TableCell>
				<span style={{fontWeight: 'bold'}}>{diffLeft}</span>
			</TableCell>
			<TableCell>
				<span style={{fontWeight: 'bold'}}>{diffRight}</span>
			</TableCell>
		</TableRow>
	);
};

const ImageDifference = ({field, oldValue, newValue}) => (
	<TableRow>
		<TableCell component="th" scope="row">
			{field}
		</TableCell>
		<TableCell align="center">
			{oldValue && <img src={pngDataURL(oldValue)} />}
		</TableCell>
		<TableCell align="center">
			{newValue && <img src={pngDataURL(newValue)} />}
		</TableCell>
	</TableRow>
);

const DifferenceRow = (props) => {
	if (props.field === 'photo') return <ImageDifference {...props} />;
	return <TextDifference {...props} />;
};

const EidCardDialogStepPreviewSingleUpdate = ({
	titleId,
	onPrevStep,
	patientId,
	eidInfo,
	navigate,
	onClose,
}: EidCardDialogStepPreviewSingleProps) => {
	const dialog = useDialog();
	const [call, {pending}] = useCall();
	const onOpen = () => {
		navigate(`/patient/${patientId}`);
		onClose();
	};

	const onNext = async () => {
		if (
			await dialog((resolve) => (
				<ConfirmationDialog
					title="Confirm"
					text="Confirm udpate operation."
					cancel="Cancel"
					confirm="Update"
					ConfirmIcon={EditAttributesIcon}
					confirmColor="secondary"
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
				await call(patientsUpdate, patientId, eidInfo);
				onOpen();
			} catch (error: unknown) {
				console.error(error);
			}
		}
	};

	const {$set} = patients.sanitize(eidInfo);
	const eidPatients = [{_id: '?', ...$set}];
	const selectedPatient = {_id: patientId};
	const selectedPatients = [selectedPatient];

	const {
		loading,
		found,
		fields: patientState,
	} = usePatient({}, patientId, {}, [patientId]);

	const differences =
		loading || !found ? [] : Array.from(computeDifferences(patientState, $set));
	const notFound = !loading && !found;

	return (
		<>
			{loading && <LinearProgress />}
			<DialogTitle id={titleId}>
				{notFound
					? 'Patient not found :-('
					: loading || differences.length > 0
					? 'Review changes'
					: 'You are all set!'}
			</DialogTitle>
			<DialogContent>
				<Grid container spacing={3} justifyContent="center" alignItems="center">
					<Grid item xs={12}>
						{differences.length > 0 && (
							<>
								<Typography variant="h5">Old</Typography>
								<DialogContentText>
									This is the record that will be updated.
								</DialogContentText>
							</>
						)}
						{notFound && (
							<DialogContentText>
								Could not fetch the patient record. This probably means it was
								deleted. Please go back and choose a different option.
							</DialogContentText>
						)}
						{loading && (
							<DialogContentText>
								We are fetching the patient&apos;s data. Please wait.
							</DialogContentText>
						)}
						<PatientsGrid
							patients={selectedPatients}
							Card={ReactivePatientCard}
							CardProps={{Card: GenericStaticPatientCard}}
						/>
					</Grid>
					{differences.length > 0 && (
						<Grid item xs={12}>
							<Typography variant="h5">New</Typography>
							<DialogContentText>
								This is what the record will look like once updated.
							</DialogContentText>
							<PatientsGrid
								patients={eidPatients}
								Card={GenericStaticPatientCard}
							/>
						</Grid>
					)}
					{differences.length > 0 && (
						<Grid item xs={12}>
							<Typography variant="h5">Changes</Typography>
							<DialogContentText>
								This is a complete list of changes that will be applied.
							</DialogContentText>
							<TableContainer component={Paper}>
								<Table aria-label="differences">
									<TableHead>
										<TableRow>
											<TableCell>Key</TableCell>
											<TableCell>Old</TableCell>
											<TableCell>New</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{differences.map((key) => (
											<DifferenceRow
												key={key}
												field={key}
												oldValue={patientState[key]}
												newValue={$set[key]}
											/>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Grid>
					)}
					{!loading && found && differences.length === 0 && (
						<Grid item xs={12}>
							<Typography variant="h5">There are no changes :)</Typography>
							<DialogContentText>
								There is no difference between the eid card information and the
								patient record. You can open the patient record by clicking the{' '}
								<em>open</em> button.
							</DialogContentText>
						</Grid>
					)}
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button startIcon={<SkipPreviousIcon />} onClick={onPrevStep}>
					Prev
				</Button>
				{differences.length > 0 && (
					<LoadingButton
						disabled={loading || !found}
						loading={pending}
						color="primary"
						endIcon={<SkipNextIcon />}
						loadingPosition="end"
						onClick={onNext}
					>
						Next
					</LoadingButton>
				)}
				{differences.length === 0 && (
					<Button
						disabled={loading || !found}
						color="primary"
						endIcon={<FolderOpenIcon />}
						onClick={onOpen}
					>
						Open
					</Button>
				)}
			</DialogActions>
		</>
	);
};

export default EidCardDialogStepPreviewSingleUpdate;
