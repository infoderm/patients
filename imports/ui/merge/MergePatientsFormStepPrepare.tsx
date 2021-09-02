import React, {useState} from 'react';

import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import {PatientDocument, PatientFields} from '../../api/collection/patients';
import PatientSheet from '../patients/PatientSheet';

import MergePatientsConfirmationDialog from './MergePatientsConfirmationDialog';
import useMergeInfo from './useMergeInfo';

interface MergeInfoError {
	message: string;
}

interface StaticMergePatientsFormStepPrepareProps {
	toMerge: string[];
	onPrevStep?: () => void;
	error?: MergeInfoError;
	oldPatients?: PatientDocument[];
	consultations?: Record<string, unknown[]>;
	attachments?: Record<string, unknown[]>;
	documents?: Record<string, unknown[]>;
	newPatient?: PatientFields;
	newConsultations?: unknown[];
	newAttachments?: unknown[];
	newDocuments?: unknown[];
}

const StaticMergePatientsFormStepPrepare = ({
	toMerge,
	onPrevStep,
	error,
	oldPatients,
	consultations,
	attachments,
	documents,
	newPatient,
	newConsultations,
	newAttachments,
	newDocuments,
}: StaticMergePatientsFormStepPrepareProps) => {
	const [merging, setMerging] = useState(false);

	return (
		<Grid container spacing={3}>
			{!error && (
				<>
					{oldPatients.map((patient) => (
						<Grid key={patient._id} item xs={12}>
							<Typography variant="h1">{patient._id}</Typography>
							<PatientSheet
								patient={patient}
								consultations={consultations[patient._id]}
								attachments={attachments[patient._id]}
								documents={documents[patient._id]}
							/>
						</Grid>
					))}
					<Grid item xs={12}>
						<Typography variant="h1">New patient information</Typography>
						<PatientSheet
							patient={newPatient}
							consultations={newConsultations}
							attachments={newAttachments}
							documents={newDocuments}
						/>
					</Grid>
				</>
			)}
			{error && (
				<Grid item xs={12}>
					<span>{error.message}</span>
				</Grid>
			)}
			<Grid item container xs={12} spacing={1}>
				{onPrevStep && (
					<Grid item>
						<Button
							color="default"
							startIcon={<SkipPreviousIcon />}
							onClick={onPrevStep}
						>
							Prev
						</Button>
					</Grid>
				)}
				{!error && (
					<Grid item>
						<Button
							variant="contained"
							color="primary"
							endIcon={<SkipNextIcon />}
							onClick={() => {
								setMerging(true);
							}}
						>
							Next
						</Button>
					</Grid>
				)}
			</Grid>
			{!error && (
				<Grid item xs={12}>
					<MergePatientsConfirmationDialog
						open={merging}
						toCreate={newPatient}
						consultationsToAttach={list(map((x) => x._id, newConsultations))}
						attachmentsToAttach={list(map((x) => x._id, newAttachments))}
						documentsToAttach={list(map((x) => x._id, newDocuments))}
						toDelete={toMerge}
						onClose={() => {
							setMerging(false);
						}}
					/>
				</Grid>
			)}
		</Grid>
	);
};

const ReactiveMergePatientsFormStepPrepare = ({toMerge, ...rest}) => {
	const reactiveProps = useMergeInfo(toMerge);
	return (
		<StaticMergePatientsFormStepPrepare
			toMerge={toMerge}
			{...reactiveProps}
			{...rest}
		/>
	);
};

export default ReactiveMergePatientsFormStepPrepare;
