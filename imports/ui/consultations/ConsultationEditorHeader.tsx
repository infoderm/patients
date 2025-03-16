import React from 'react';

import Grid from '@mui/material/Grid';
import FaceIcon from '@mui/icons-material/Face';

import {DateTimePicker} from '@mui/x-date-pickers';

import pngDataURL from '../../util/png/dataURL';

import {LinkedSubheaderAvatar, Subheader} from '../Subheader';

import CopiableTextField from '../input/CopiableTextField';

import usePatient from '../patients/usePatient';

import {
	type ConsultationEditorInit,
	type State,
} from './useConsultationEditorState';

type Props = {
	readonly consultation: ConsultationEditorInit;
	readonly state: State;
	readonly update: (
		key: keyof State['fields'],
	) => (event: {target: {value: Date | null}}) => void;
};

const ConsultationEditorHeader = ({
	consultation,
	state: {fields},
	update,
}: Props) => {
	const patientId = consultation.patientId;

	const init = {};
	const query = {
		filter: {_id: patientId},
		projection: {
			niss: 1,
			firstname: 1,
			lastname: 1,
			photo: 1,
		},
	} as const;
	const deps = [JSON.stringify(query)];

	const {loading, fields: patient} = usePatient(init, query, deps);

	const {datetime, doneDatetime} = fields;

	const textPlaceHolder = loading ? '' : '?';

	return (
		<Subheader container spacing={3}>
			<Grid item>
				{patient.photo ? (
					<LinkedSubheaderAvatar
						alt={`${patient.firstname} ${patient.lastname}`}
						src={pngDataURL(patient.photo)}
						to={`/patient/${patientId}`}
					/>
				) : (
					<LinkedSubheaderAvatar to={`/patient/${patientId}`}>
						<FaceIcon />
					</LinkedSubheaderAvatar>
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
					value={datetime}
					label="Begin"
					slotProps={{
						textField: {
							InputLabelProps: {shrink: true},
						},
					}}
					onChange={(value) => {
						update('datetime')({target: {value}});
					}}
				/>
			</Grid>
			<Grid item xs={2}>
				<DateTimePicker
					disabled
					value={doneDatetime}
					label="End"
					slotProps={{
						textField: {
							InputLabelProps: {shrink: true},
						},
					}}
					onChange={(value) => {
						update('doneDatetime')({target: {value}});
					}}
				/>
			</Grid>
		</Subheader>
	);
};

export default ConsultationEditorHeader;
