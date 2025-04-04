import React from 'react';

import Grid from '@mui/material/Grid';

import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import Avatar from '@mui/material/Avatar';

import FaceIcon from '@mui/icons-material/Face';

import pngDataURL from '../../util/png/dataURL';

import {type PatientDocument} from '../../api/collection/patients';
import {patients} from '../../api/patients';

import SetPicker from '../input/SetPicker';

import PatientGridItem from '../patients/PatientGridItem';
import ReactivePatientCard from '../patients/ReactivePatientCard';
import makePatientsSuggestions from '../patients/makePatientsSuggestions';

import usePatient from '../patients/usePatient';

const Suggestion = ({item: patient}) => {
	const {fields} = usePatient(
		patient,
		{filter: {_id: patient._id}, projection: {photo: 1}},
		[patient._id],
	);

	const patientName = `${patient.lastname} ${patient.firstname}`;

	return (
		<>
			<ListItemAvatar>
				{fields.photo ? (
					<Avatar src={pngDataURL(fields.photo)} />
				) : (
					<Avatar>
						<FaceIcon />
					</Avatar>
				)}
			</ListItemAvatar>
			<ListItemText primary={patientName} secondary={patient._id} />
		</>
	);
};

type Props = {
	readonly selection: PatientDocument[];
	readonly setSelection: (selection: PatientDocument[]) => void;
	readonly label?: string;
	readonly placeholder?: string;
};

const MergePatientsFormStepSelect = ({
	selection,
	setSelection,
	label = 'Select patients',
	placeholder = 'Select patients by entering their names here',
}: Props) => (
	<Grid container spacing={2}>
		<Grid item xs={12}>
			<SetPicker
				itemToKey={(x) => x._id}
				itemToString={patients.toString}
				Item={Suggestion}
				useSuggestions={makePatientsSuggestions(selection)}
				TextFieldProps={{
					label,
					margin: 'normal',
				}}
				value={selection}
				placeholder={placeholder}
				onChange={(e) => {
					setSelection(e.target.value);
				}}
			/>
		</Grid>
		<Grid item container xs={12} spacing={3}>
			{selection.map((patient) => (
				<PatientGridItem
					key={patient._id}
					Card={ReactivePatientCard}
					patient={patient}
				/>
			))}
		</Grid>
	</Grid>
);

export default MergePatientsFormStepSelect;
