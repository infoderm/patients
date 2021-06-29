import React from 'react';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import LinearProgress from '@material-ui/core/LinearProgress';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import {Alert, AlertTitle} from '@material-ui/lab';

import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CancelIcon from '@material-ui/icons/Cancel';

import dateFormat from 'date-fns/format';
import isBefore from 'date-fns/isBefore';
import startOfToday from 'date-fns/startOfToday';
import addMilliseconds from 'date-fns/addMilliseconds';

import {msToString} from '../../client/duration';

import {patients} from '../../api/patients';
import {useSetting} from '../../client/settings';

import useIntersectingEvents from '../events/useIntersectingEvents';

import usePatient from '../patients/usePatient';

import useStateWithInitOverride from '../hooks/useStateWithInitOverride';

import withLazyOpening from '../modal/withLazyOpening';
import PatientPicker from '../patients/PatientPicker';

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	},
	dialogPaper: {
		overflow: 'visible'
	},
	multiline: {
		overflow: 'auto',
		width: '100%'
	}
}));

const usePhone = (patientList) => {
	const patientId = patientList.length === 1 ? patientList[0]._id : '?';

	const options = {fields: {phone: 1}};

	const deps = [patientId, JSON.stringify(options)];

	const {found, fields: patient} = usePatient({}, patientId, options, deps);

	const initPhone = found ? patient.phone : '';

	return useStateWithInitOverride(initPhone);
};

const AppointmentDialog = (props) => {
	const classes = useStyles();
	const history = useHistory();

	const {
		initialDatetime,
		noInitialTime,
		initialAppointment,
		initialPatient,
		open,
		onClose,
		onSubmit
	} = props;

	const {loading, value: appointmentDuration} = useSetting(
		'appointment-duration'
	);

	const [date, setDate] = useStateWithInitOverride(
		dateFormat(initialDatetime, 'yyyy-MM-dd')
	);
	const [time, setTime] = useStateWithInitOverride(
		noInitialTime ? '' : dateFormat(initialDatetime, 'HH:mm')
	);
	const [duration, setDuration] = useStateWithInitOverride(
		appointmentDuration.includes(initialAppointment?.duration)
			? initialAppointment.duration
			: appointmentDuration.length > 0
			? appointmentDuration[0]
			: 0,
		[initialAppointment, appointmentDuration]
	);
	const [reason, setReason] = useStateWithInitOverride(
		initialAppointment?.reason || '',
		[initialAppointment]
	);

	const [patientList, setPatientList] = useStateWithInitOverride(
		initialPatient ? [initialPatient] : [],
		[initialPatient]
	);
	const [phone, setPhone] = usePhone(patientList);
	const [patientError, setPatientError] = useStateWithInitOverride('', [
		initialPatient
	]);
	const patientIsReadOnly = Boolean(initialPatient);

	const datetime = new Date(`${date}T${time}`);
	const appointmentIsInThePast = isBefore(new Date(date), startOfToday());
	const displayAppointmentIsInThePast = appointmentIsInThePast;

	const _id = initialAppointment?._id;
	const begin = datetime;
	const end = addMilliseconds(datetime, duration);
	const {results: overlappingEvents} = useIntersectingEvents(
		begin,
		end,
		{
			_id: {$not: _id},
			isCancelled: {$not: true}
		},
		{limit: 1},
		[_id, Number(datetime), duration]
	);
	const appointmentOverlapsWithAnotherEvent = overlappingEvents.length > 0;

	const createAppointment = (event) => {
		event.preventDefault();

		if (patientList.length === 1) {
			setPatientError('');
			const args = {
				datetime,
				duration,
				patient: patientList[0],
				phone,
				reason
			};
			console.debug(args);
			onSubmit(args, (err, res) => {
				if (err) {
					console.error(err);
				} else {
					console.log(
						`Consultation #${res._id} ${
							initialAppointment ? 'updated' : 'created'
						}.`
					);
					onClose();
					if (!initialAppointment) {
						history.push({pathname: `/consultation/${res._id}`});
					}
				}
			});
		} else {
			setPatientError("The patient's name is required");
		}
	};

	return (
		<Dialog
			classes={{paper: classes.dialogPaper}}
			open={open}
			// component="form"
			aria-labelledby="new-appointment-dialog-title"
			onClose={onClose}
		>
			{loading && <LinearProgress />}
			<DialogTitle id="new-appointment-dialog-title">
				Schedule an appointment
			</DialogTitle>
			<DialogContent className={classes.dialogPaper}>
				<Grid container>
					<Grid item xs={4}>
						<TextField
							type="date"
							label="Date"
							InputLabelProps={{
								shrink: true
							}}
							value={date}
							error={!date || displayAppointmentIsInThePast}
							helperText={
								displayAppointmentIsInThePast
									? 'Date dans le passé!'
									: undefined
							}
							onChange={(e) => setDate(e.target.value)}
						/>
					</Grid>
					<Grid item xs={4}>
						<TextField
							type="time"
							label="Time"
							InputLabelProps={{
								shrink: true
							}}
							value={time}
							error={!time}
							onChange={(e) => setTime(e.target.value)}
						/>
					</Grid>
					<Grid item xs={4}>
						<FormControl>
							<InputLabel htmlFor="duration">Duration</InputLabel>
							<Select
								readOnly={loading}
								value={duration}
								inputProps={{
									name: 'duration',
									id: 'duration'
								}}
								onChange={(e) => setDuration(e.target.value)}
							>
								{appointmentDuration.map((x) => (
									<MenuItem key={x} value={x}>
										{msToString(x)}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<PatientPicker
							readOnly={patientIsReadOnly}
							TextFieldProps={{
								autoFocus: true,
								label: "Patient's lastname then firstname(s)",
								margin: 'normal',
								helperText: patientError,
								error: Boolean(patientError)
							}}
							value={patientList}
							maxCount={1}
							placeholder="Patient's lastname then firstname(s)"
							createNewItem={patients.create}
							onChange={(e) => setPatientList(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							multiline
							label="Numéro de téléphone"
							placeholder="Numéro de téléphone"
							rows={1}
							className={classes.multiline}
							value={phone}
							InputLabelProps={{shrink: Boolean(phone)}}
							margin="normal"
							disabled={patientList.length !== 1 || patientList[0]._id !== '?'}
							onChange={(e) => setPhone(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							multiline
							label="Motif de la visite"
							placeholder="Motif de la visite"
							rows={4}
							className={classes.multiline}
							value={reason}
							margin="normal"
							onChange={(e) => setReason(e.target.value)}
						/>
					</Grid>
					{appointmentOverlapsWithAnotherEvent && (
						<Grid item xs={12}>
							<Alert severity="warning">
								<AlertTitle>Attention</AlertTitle>
								Ce rendez-vous <strong>chevauche un autre évènement</strong>!
							</Alert>
						</Grid>
					)}
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button type="submit" color="default" onClick={onClose}>
					Cancel
					<CancelIcon className={classes.rightIcon} />
				</Button>
				<Button
					disabled={patientList.length !== 1 || !date || !time}
					color="primary"
					onClick={createAppointment}
				>
					Schedule
					<AccessTimeIcon className={classes.rightIcon} />
				</Button>
			</DialogActions>
		</Dialog>
	);
};

AppointmentDialog.defaultProps = {
	noInitialTime: false
};

AppointmentDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	initialDatetime: PropTypes.instanceOf(Date).isRequired,
	noInitialTime: PropTypes.bool,
	initialAppointment: PropTypes.object,
	initialPatient: PropTypes.object
};

export default withLazyOpening(AppointmentDialog);
