import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';
import {_chain as chain} from '@iterable-iterator/chain';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import PatientSheet from '../patients/PatientSheet';

import {Patients, patients} from '../../api/patients';
import {Consultations} from '../../api/consultations';
import {Attachments} from '../../api/attachments';
import {Documents} from '../../api/documents';
import MergePatientsConfirmationDialog from './MergePatientsConfirmationDialog';

const MergePatientsFormStepPrepare = (props) => {
	const {
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
		newDocuments
	} = props;

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
							onClick={() => setMerging(true)}
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
						onClose={() => setMerging(false)}
					/>
				</Grid>
			)}
		</Grid>
	);
};

MergePatientsFormStepPrepare.propTypes = {
	toMerge: PropTypes.array.isRequired
};

export default withTracker(({toMerge}) => {
	for (const patientId of toMerge) {
		Meteor.subscribe('patient', patientId);
		Meteor.subscribe('patient.consultationsAndAppointments', patientId);
		Meteor.subscribe('patient.attachments', patientId);
		Meteor.subscribe('patient.documents.all', patientId);
	}

	const oldPatients = [];
	const consultations = {};
	const attachments = {};
	const documents = {};
	for (const patientId of toMerge) {
		const patient = Patients.findOne(patientId);
		if (patient === undefined) {
			const error = {
				message: `Cannot merge because patient #${patientId} does not exist in the database.`
			};
			return {error};
		}

		const consultationsForPatient = Consultations.find(
			{patientId},
			{sort: {datetime: -1}}
		).fetch();
		const attachmentsForPatient = Attachments.find(
			{'meta.attachedToPatients': patientId},
			{sort: {'meta.createdAt': -1}}
		).fetch();
		const documentsForPatient = Documents.find(
			{patientId},
			{sort: {createdAt: -1}}
		).fetch();
		oldPatients.push(patient);
		consultations[patientId] = consultationsForPatient;
		attachments[patientId] = attachmentsForPatient;
		documents[patientId] = documentsForPatient;
	}

	return {
		oldPatients,
		consultations,
		attachments,
		documents,
		newPatient: patients.merge(oldPatients),
		newConsultations: list(chain(map((x) => consultations[x] || [], toMerge))),
		newAttachments: list(chain(map((x) => attachments[x] || [], toMerge))),
		newDocuments: list(chain(map((x) => documents[x] || [], toMerge)))
	};
})(MergePatientsFormStepPrepare);
