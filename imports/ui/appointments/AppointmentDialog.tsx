import React from 'react';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import LinearProgress from '@material-ui/core/LinearProgress';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import {Alert, AlertTitle} from '@material-ui/lab';
import {DatePicker, TimePicker} from '@material-ui/pickers';

import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CancelIcon from '@material-ui/icons/Cancel';

import dateFormat from 'date-fns/format';
import isValid from 'date-fns/isValid';
import isBefore from 'date-fns/isBefore';
import startOfToday from 'date-fns/startOfToday';
import addMilliseconds from 'date-fns/addMilliseconds';
import TextField from '../input/TextField';

import {useDateMask} from '../../i18n/datetime';

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

const serializeDate = (datetime: Date) => dateFormat(datetime, 'yyyy-MM-dd');
const serializeTime = (datetime: Date) => dateFormat(datetime, 'HH:mm');
const unserializeDate = (date: string) => new Date(date);
const unserializeDatetime = (date: string, time: string) =>
	new Date(`${date}T${time}`);
const unserializeTime = (time: string) =>
	unserializeDatetime('1970-01-01', time);
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
		serializeDate(initialDatetime)
	);
	const [validDate, setValidDate] = useStateWithInitOverride(
		isValid(initialDatetime)
	);
	const [time, setTime] = useStateWithInitOverride(
		noInitialTime ? '' : serializeTime(initialDatetime)
	);
	const [validTime, setValidTime] = useStateWithInitOverride(
		!noInitialTime && isValid(initialDatetime)
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

	const localizedDateMask = useDateMask();

	const datetime = unserializeDatetime(date, time);
	const appointmentIsInThePast = isBefore(
		unserializeDate(date),
		startOfToday()
	);
	const displayAppointmentIsInThePast = appointmentIsInThePast;

	const _id = initialAppointment?._id;
	const begin = datetime;
	const end = addMilliseconds(datetime, duration);
	const {results: overlappingEvents} = useIntersectingEvents(
		begin,
		end,
		{
			_id: {$ne: _id},
			isCancelled: {$ne: true}
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

	const patientIsSelected = patientList.length === 1;
	const selectedPatientExists = patientIsSelected && patientList[0]._id !== '?';
	const phoneIsDisabled = !patientIsSelected;
	const phoneIsReadOnly = !phoneIsDisabled && selectedPatientExists;
	const phonePlaceholder = patientIsSelected
		? selectedPatientExists
			? 'Add a phone number to this patient by editing their information'
			: 'Enter a phone number'
		: 'Select a patient first';
	const phoneHelperText =
		selectedPatientExists && phone
			? "Edit this patient's phone number by editing their information"
			: '';
	const phoneError = patientIsSelected && !selectedPatientExists && !phone;

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
				<Grid container spacing={3}>
					<Grid item xs={4}>
						<DatePicker
							mask={localizedDateMask}
							value={unserializeDate(date)}
							label="Date"
							renderInput={(props) => (
								<TextField
									{...props}
									InputLabelProps={{shrink: true}}
									error={!validDate || displayAppointmentIsInThePast}
									helperText={
										displayAppointmentIsInThePast
											? 'Date dans le passé!'
											: undefined
									}
								/>
							)}
							onChange={(pickedDatetime) => {
								if (isValid(pickedDatetime)) {
									setDate(serializeDate(pickedDatetime));
									setValidDate(true);
								} else {
									setValidDate(false);
								}
							}}
						/>
					</Grid>
					<Grid item xs={4}>
						<TimePicker
							renderInput={(props) => (
								<TextField
									{...props}
									InputLabelProps={{shrink: true}}
									error={!validTime}
								/>
							)}
							label="Time"
							value={unserializeTime(time)}
							onChange={(pickedDatetime) => {
								if (isValid(pickedDatetime)) {
									setTime(serializeTime(pickedDatetime));
									setValidTime(true);
								} else {
									setValidTime(false);
								}
							}}
						/>
					</Grid>
					<Grid item xs={4}>
						<FormControl fullWidth>
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
							placeholder={phonePlaceholder}
							helperText={phoneHelperText}
							error={phoneError}
							rows={1}
							className={classes.multiline}
							value={phone}
							InputLabelProps={{shrink: true}}
							margin="normal"
							readOnly={phoneIsReadOnly}
							disabled={phoneIsDisabled}
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
					disabled={patientList.length !== 1 || !validDate || !validTime}
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
