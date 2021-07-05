import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';

import {useDateFormat} from '../../i18n/datetime';

import {dataURL as pngDataURL} from '../../util/png';

import eidDisplayBirthdate from '../../api/eidDisplayBirthdate';

import TextField from '../input/TextField';
import CopiableTextField from '../input/CopiableTextField';

import useStyles from '../styles/subheader';

import useCachedPatient from './useCachedPatient';

const PatientHeader = ({patientId}) => {
	const init = {_id: patientId};
	const query = patientId;
	const options = {};
	const deps = [query];

	const {
		loading,
		found,
		fields: patient
	} = useCachedPatient(init, query, options, deps);

	const classes = useStyles();

	const localizeBirthdate = useDateFormat('PPP');

	const textPlaceHolder = loading ? '' : '?';

	return (
		<Grid container className={classes.container} spacing={3}>
			<Grid item>
				{!patient.photo ? (
					<Avatar className={classes.avatar}>
						<FaceIcon />
					</Avatar>
				) : (
					<Avatar
						alt={`${patient.firstname} ${patient.lastname}`}
						src={pngDataURL(patient.photo)}
						className={classes.avatar}
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
				<TextField
					readOnly
					label="Birth date"
					value={
						eidDisplayBirthdate(patient.birthdate, localizeBirthdate) ?? ''
					}
					InputLabelProps={{
						shrink: true
					}}
					placeholder={textPlaceHolder}
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
