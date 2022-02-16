import assert from 'assert';

import React, {useMemo} from 'react';
import {useNavigate} from 'react-router-dom';

import {styled} from '@mui/material/styles';

import LinearProgress from '@mui/material/LinearProgress';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MuiDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import DatePicker from '@mui/lab/DatePicker';
import TimePicker from '@mui/lab/DesktopTimePicker';

import AccessTimeIcon from '@mui/icons-material/AccessTime';

import dateFormat from 'date-fns/format';
import isValid from 'date-fns/isValid';
import isBefore from 'date-fns/isBefore';
import startOfToday from 'date-fns/startOfToday';
import addMilliseconds from 'date-fns/addMilliseconds';
import TextField from '../input/TextField';

import CancelButton from '../button/CancelButton';

import {useDateMask} from '../../i18n/datetime';

import {msToString} from '../../api/duration';

import {AppointmentDocument} from '../../api/collection/appointments';
import {SanitizeParams} from '../../api/appointments';

import {patients} from '../../api/patients';
import {useSetting} from '../settings/hooks';

import useIntersectingEvents from '../events/useIntersectingEvents';

import usePatient from '../patients/usePatient';

import useStateWithInitOverride from '../hooks/useStateWithInitOverride';

import withLazyOpening from '../modal/withLazyOpening';
import PatientPicker from '../patients/PatientPicker';
import {weekShifted} from '../../api/availability';
import useQuerySortedWorkSchedule from '../settings/useQuerySortedWorkSchedule';
import nonOverlappingIntersectionQuery from '../../lib/interval/nonOverlappingIntersectionQuery';
import isContiguous from '../../lib/interval/isContiguous';

const Dialog = styled(MuiDialog)({
	'& .MuiDialog-paper': {
		overflow: 'visible',
	},
});

const DialogContent = styled(MuiDialogContent)({
	overflow: 'visible',
});

const Multiline = styled(TextField)({
	overflow: 'auto',
	width: '100%',
});

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

const isEqual = (a, b) => a === b;

interface Props {
	open: boolean;
	onClose: () => void;
	onSubmit: (args: SanitizeParams) => Promise<{_id: string}>;
	initialDatetime: Date;
	noInitialTime: boolean;
	initialAppointment?: AppointmentDocument;
	initialPatient?: {};
}

const AppointmentDialog = ({
	initialDatetime,
	noInitialTime = false,
	initialAppointment,
	initialPatient,
	open,
	onClose,
	onSubmit,
}: Props) => {
	const navigate = useNavigate();

	const {loading, value: appointmentDuration} = useSetting(
		'appointment-duration',
	);

	const [date, setDate] = useStateWithInitOverride(
		serializeDate(initialDatetime),
	);
	const [validDate, setValidDate] = useStateWithInitOverride(
		isValid(initialDatetime),
	);
	const [time, setTime] = useStateWithInitOverride(
		noInitialTime ? '' : serializeTime(initialDatetime),
	);
	const [validTime, setValidTime] = useStateWithInitOverride(
		!noInitialTime && isValid(initialDatetime),
	);
	const [duration, setDuration] = useStateWithInitOverride(
		appointmentDuration.includes(initialAppointment?.duration)
			? initialAppointment.duration
			: appointmentDuration.length > 0
			? appointmentDuration[0]
			: 0,
		[initialAppointment, appointmentDuration],
	);
	const [reason, setReason] = useStateWithInitOverride(
		initialAppointment?.reason || '',
		[initialAppointment],
	);

	const [patientList, setPatientList] = useStateWithInitOverride(
		initialPatient ? [initialPatient] : [],
		[initialPatient],
	);
	const [phone, setPhone] = usePhone(patientList);
	const [patientError, setPatientError] = useStateWithInitOverride('', [
		initialPatient,
	]);
	const patientIsReadOnly = Boolean(initialPatient);

	const localizedDateMask = useDateMask();

	const datetime = unserializeDatetime(date, time);
	const appointmentIsInThePast = isBefore(
		unserializeDate(date),
		startOfToday(),
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
			isCancelled: {$ne: true},
		},
		{limit: 1},
		[_id, Number(datetime), duration],
	);
	const appointmentOverlapsWithAnotherEvent = overlappingEvents.length > 0;

	const workSchedule = useQuerySortedWorkSchedule();

	const appointmentReachesOutsideWorkSchedule = useMemo(() => {
		if (!isValid(begin) || !isValid(end)) return false;
		const intervals = workSchedule.map(({beginModuloWeek, endModuloWeek}) => [
			beginModuloWeek,
			endModuloWeek,
		]) as Array<[number, number]>;
		const [weekShiftedBegin, weekShiftedEnd] = weekShifted(begin, end);
		const intersectionWithWorkSchedule = Array.from(
			nonOverlappingIntersectionQuery(intervals, [
				weekShiftedBegin,
				weekShiftedEnd,
			]),
		);
		const span =
			intersectionWithWorkSchedule.length === 0
				? 0
				: intersectionWithWorkSchedule[
						intersectionWithWorkSchedule.length - 1
				  ][1] - intersectionWithWorkSchedule[0][0];
		const measure = Number(end) - Number(begin);
		assert(span <= measure);
		return (
			span < measure || !isContiguous(isEqual, intersectionWithWorkSchedule)
		);
	}, [workSchedule, Number(begin), Number(end)]);

	const createAppointment = async (event) => {
		event.preventDefault();

		if (patientList.length === 1) {
			setPatientError('');
			const args = {
				datetime,
				duration,
				patient: patientList[0],
				phone,
				reason,
			};
			console.debug(args);
			try {
				const res = await onSubmit(args);
				console.log(
					`Consultation #${res._id} ${
						initialAppointment ? 'updated' : 'created'
					}.`,
				);
				onClose();
				if (!initialAppointment) {
					navigate({pathname: `/consultation/${res._id}`});
				}
			} catch (error: unknown) {
				console.error({error});
			}
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
		<Dialog open={open}>
			{loading && <LinearProgress />}
			<DialogTitle>Schedule an appointment</DialogTitle>
			<DialogContent>
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
									id: 'duration',
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
								error: Boolean(patientError),
							}}
							value={patientList}
							maxCount={1}
							placeholder="Patient's lastname then firstname(s)"
							createNewItem={patients.create}
							onChange={(e) => setPatientList(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Multiline
							multiline
							label="Numéro de téléphone"
							placeholder={phonePlaceholder}
							helperText={phoneHelperText}
							error={phoneError}
							rows={1}
							value={phone}
							InputLabelProps={{shrink: true}}
							margin="normal"
							readOnly={phoneIsReadOnly}
							disabled={phoneIsDisabled}
							onChange={(e) => setPhone(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Multiline
							multiline
							label="Motif de la visite"
							placeholder="Motif de la visite"
							rows={4}
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
					{appointmentReachesOutsideWorkSchedule && (
						<Grid item xs={12}>
							<Alert severity="warning">
								<AlertTitle>Attention</AlertTitle>
								Ce rendez-vous{' '}
								<strong>est en dehors de l&apos;horaire programmé</strong>!
							</Alert>
						</Grid>
					)}
				</Grid>
			</DialogContent>
			<DialogActions>
				<CancelButton onClick={onClose} />
				<Button
					disabled={patientList.length !== 1 || !validDate || !validTime}
					color="primary"
					endIcon={<AccessTimeIcon />}
					onClick={createAppointment}
				>
					Schedule
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(AppointmentDialog);
