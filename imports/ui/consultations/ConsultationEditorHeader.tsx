import React from 'react';

import Grid from '@mui/material/Grid';
import FaceIcon from '@mui/icons-material/Face';

import DateTimePicker from '@mui/lab/DateTimePicker';

import {dataURL as pngDataURL} from '../../util/png';

import {useDateTimeMask} from '../../i18n/datetime';

import {LinkedSubheaderAvatar, Subheader} from '../Subheader';

import TextField from '../input/TextField';
import CopiableTextField from '../input/CopiableTextField';

import usePatient from '../patients/usePatient';

const ConsultationEditorHeader = ({consultation, state, update}) => {
	const patientId = consultation.patientId;

	const init = {};
	const query = patientId;
	const options = {
		fields: {
			niss: 1,
			firstname: 1,
			lastname: 1,
			photo: 1,
		},
	};
	const deps = [query];

	const {loading, fields: patient} = usePatient(init, query, options, deps);

	const localizedDateTimeMask = useDateTimeMask();

	const {datetime, doneDatetime} = state;

	const textPlaceHolder = loading ? '' : '?';

	return (
		<Subheader container spacing={3}>
			<Grid item>
				{!patient.photo ? (
					<LinkedSubheaderAvatar to={`/patient/${patientId}`}>
						<FaceIcon />
					</LinkedSubheaderAvatar>
				) : (
					<LinkedSubheaderAvatar
						alt={`${patient.firstname} ${patient.lastname}`}
						src={pngDataURL(patient.photo)}
						to={`/patient/${patientId}`}
					/>
				)}
			</Grid>
			<Grid item xs={2}>
				<CopiableTextField
					readOnly
					label="Lastname"
					value={patient.lastname ?? ''}
					placeholder={textPlaceHolder}
				/>
			</Grid>
			<Grid item xs={2}>
				<CopiableTextField
					readOnly
					label="Firstname"
					value={patient.firstname ?? ''}
					placeholder={textPlaceHolder}
				/>
			</Grid>
			<Grid item xs={2}>
				<CopiableTextField
					readOnly
					label="NISS"
					value={patient.niss ?? ''}
					placeholder={textPlaceHolder}
				/>
			</Grid>
			<Grid item xs={2}>
				<DateTimePicker
					mask={localizedDateTimeMask}
					value={datetime}
					label="Begin"
					renderInput={(props) => (
						<TextField {...props} InputLabelProps={{shrink: true}} />
					)}
					onChange={(value) => {
						update('datetime')({target: {value}});
					}}
				/>
			</Grid>
			<Grid item xs={2}>
				<DateTimePicker
					disabled
					mask={localizedDateTimeMask}
					value={doneDatetime}
					label="End"
					renderInput={(props) => (
						<TextField {...props} InputLabelProps={{shrink: true}} />
					)}
					onChange={(value) => {
						update('doneDatetime')({target: {value}});
					}}
				/>
			</Grid>
		</Subheader>
	);
};

export default ConsultationEditorHeader;
