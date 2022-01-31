import assert from 'assert';
import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import LinearProgress from '@material-ui/core/LinearProgress';

import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';

import EditAttributesIcon from '@material-ui/icons/EditAttributes';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

import diff from '../../util/diff';
import {dataURL as pngDataURL} from '../../util/png';

import call from '../../api/endpoint/call';
import patientsUpdate from '../../api/endpoint/patients/update';
import {patients} from '../../api/patients';

import dialog from '../modal/dialog';
import ConfirmationDialog from '../modal/ConfirmationDialog';

import GenericStaticPatientCard from '../patients/GenericStaticPatientCard';
import ReactivePatientCard from '../patients/ReactivePatientCard';
import PatientsGrid from '../patients/PatientsGrid';
import usePatient from '../patients/usePatient';

import EidCardDialogStepPreviewSingleProps from './EidCardDialogStepPreviewSingleProps';

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
			case -1:
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
			case 1:
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
			default:
				assert(type === 0);
				yield <span key={++key}>{value}</span>;
				break;
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
	onPrevStep,
	patientId,
	eidInfo,
	history,
	onClose,
}: EidCardDialogStepPreviewSingleProps) => {
	const onOpen = () => {
		history.push({pathname: `/patient/${patientId}`});
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

	const eidPatient = patients.sanitize(eidInfo);
	const eidPatients = [{_id: '?', ...eidPatient}];
	const selectedPatient = {_id: patientId};
	const selectedPatients = [selectedPatient];

	const {
		loading,
		found,
		fields: patientState,
	} = usePatient({}, patientId, {}, [patientId]);

	const differences =
		loading || !found
			? []
			: Array.from(computeDifferences(patientState, eidPatient));
	const notFound = !loading && !found;

	return (
		<>
			{loading && <LinearProgress />}
			<DialogTitle>
				{notFound
					? 'Patient not found :-('
					: loading || differences.length > 0
					? 'Review changes'
					: 'You are all set!'}
			</DialogTitle>
			<DialogContent>
				<Grid container spacing={3} justify="center" alignItems="center">
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
												newValue={eidPatient[key]}
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
				<Button
					type="submit"
					startIcon={<SkipPreviousIcon />}
					onClick={onPrevStep}
				>
					Prev
				</Button>
				{differences.length > 0 && (
					<Button
						disabled={loading || !found}
						color="primary"
						endIcon={<SkipNextIcon />}
						onClick={onNext}
					>
						Next
					</Button>
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
