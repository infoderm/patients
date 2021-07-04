import React from 'react';

import {Link} from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';

import {MobileDateTimePicker as DateTimePicker} from '@material-ui/pickers';

import {useDateMask} from '../../i18n/datetime';

import TextField from '../input/TextField';
import CopiableTextField from '../input/CopiableTextField';

import usePatient from '../patients/usePatient';

import useStyles from '../styles/subheader';

const ConsultationEditorHeader = ({consultation, state, update}) => {
	const patientId = consultation.patientId;

	const init = {};
	const query = patientId;
	const options = {
		fields: {
			niss: 1,
			firstname: 1,
			lastname: 1,
			photo: 1
		}
	};
	const deps = [query];

	const {loading, fields: patient} = usePatient(init, query, options, deps);

	const classes = useStyles();

	const localizedDateMask = useDateMask();

	const {datetime, doneDatetime} = state;

	const textPlaceHolder = loading ? '' : '?';

	return (
		<Grid container className={classes.container} spacing={3}>
			<Grid item>
				{!patient.photo ? (
					<Avatar
						className={classes.avatar}
						component={Link}
						to={`/patient/${patientId}`}
					>
						<FaceIcon />
					</Avatar>
				) : (
					<Avatar
						alt={`${patient.firstname} ${patient.lastname}`}
						src={`data:image/png;base64,${patient.photo}`}
						className={classes.avatar}
						component={Link}
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
					mask={localizedDateMask}
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
					mask={localizedDateMask}
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
		</Grid>
	);
};

export default ConsultationEditorHeader;
