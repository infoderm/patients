import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import TextField from '../input/TextField.js';
import Avatar from '@material-ui/core/Avatar';

import FaceIcon from '@material-ui/icons/Face';

import useStyles from '../styles/subheader.js';

import useCachedPatient from './useCachedPatient.js';

const PatientHeader = ({patientId}) => {
	const init = {_id: patientId};
	const query = patientId;
	const options = {};
	const deps = [query];

	const {loading, found, fields: patient} = useCachedPatient(
		init,
		query,
		options,
		deps
	);

	const classes = useStyles();

	return (
		<Grid container className={classes.container} spacing={3}>
			<Grid item>
				{!patient || !patient.photo ? (
					<Avatar className={classes.avatar}>
						<FaceIcon />
					</Avatar>
				) : (
					<Avatar
						alt={`${patient.firstname} ${patient.lastname}`}
						src={`data:image/png;base64,${patient.photo}`}
						className={classes.avatar}
					/>
				)}
			</Grid>
			<Grid item xs={2}>
				<TextField
					readOnly
					label="Lastname"
					value={!patient ? '?' : patient.lastname || ''}
				/>
			</Grid>
			<Grid item xs={2}>
				<TextField
					readOnly
					label="Firstname"
					value={!patient ? '?' : patient.firstname || ''}
				/>
			</Grid>
			<Grid item xs={2}>
				<TextField
					readOnly
					label="NISS"
					value={!patient ? '?' : patient.niss || ''}
				/>
			</Grid>
			<Grid item xs={2}>
				<TextField
					readOnly
					label="Patient id"
					value={patientId}
					error={!loading && !found}
				/>
			</Grid>
		</Grid>
	);
};

PatientHeader.propTypes = {
	patientId: PropTypes.string.isRequired
};

export default PatientHeader;
