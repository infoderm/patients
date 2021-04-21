import React from 'react';

import {Link} from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import TextField from '../input/TextField.js';

import {makeStyles, createStyles} from '@material-ui/core/styles';

import usePatient from '../patients/usePatient.js';

const styles = () =>
	createStyles({
		header: {
			backgroundColor: 'white',
			position: 'fixed',
			top: '76px',
			paddingTop: '0.4em',
			zIndex: 10,
			marginLeft: '-24px',
			marginRight: '-24px',
			boxShadow:
				'0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0, 0, 0, 0.12)'
		},
		avatar: {
			width: '48px',
			height: '48px'
		}
	});

const useStyles = makeStyles(styles);

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

	const {date, time} = state;

	return (
		<Grid container className={classes.header} spacing={3}>
			{loading || !patient || !patient.photo ? null : (
				<Grid item>
					<Avatar
						alt={`${patient.firstname} ${patient.lastname}`}
						src={`data:image/png;base64,${patient.photo}`}
						className={classes.avatar}
						component={Link}
						to={`/patient/${patientId}`}
					/>
				</Grid>
			)}
			{loading || !patient ? null : (
				<Grid item xs={2}>
					<TextField readOnly label="Lastname" value={patient.lastname} />
				</Grid>
			)}
			{loading || !patient ? null : (
				<Grid item xs={2}>
					<TextField readOnly label="Firstname" value={patient.firstname} />
				</Grid>
			)}
			{loading || !patient ? null : (
				<Grid item xs={2}>
					<TextField readOnly label="NISS" value={patient.niss} />
				</Grid>
			)}
			{!loading && patient ? null : (
				<Grid item xs={2}>
					<TextField disabled label="Patient id" value={patientId} />
				</Grid>
			)}
			<Grid item xs={2}>
				<TextField
					type="date"
					label="Date"
					InputLabelProps={{
						shrink: true
					}}
					value={date}
					onChange={update('date')}
				/>
			</Grid>
			<Grid item xs={1}>
				<TextField
					type="time"
					label="Time"
					InputLabelProps={{
						shrink: true
					}}
					value={time}
					onChange={update('time')}
				/>
			</Grid>
		</Grid>
	);
};

export default ConsultationEditorHeader;
