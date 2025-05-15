import assert from 'assert';

import React, {useMemo} from 'react';
import {useNavigate} from 'react-router-dom';

import {styled} from '@mui/material/styles';

import LinearProgress from '@mui/material/LinearProgress';

import Grid from '@mui/material/Grid';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import {DatePicker, DesktopTimePicker as TimePicker} from '@mui/x-date-pickers';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import isValid from 'date-fns/isValid';
import isBefore from 'date-fns/isBefore';
import startOfToday from 'date-fns/startOfToday';
import addMilliseconds from 'date-fns/addMilliseconds';
import isDateEqual from 'date-fns/isEqual';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import TextField from '../input/TextField';

import CancelButton from '../button/CancelButton';

import {msToString} from '../../api/duration';

import {type AppointmentDocument} from '../../api/collection/appointments';

import {patients} from '../../api/patients';
import {useSettingCached} from '../settings/hooks';

import useIntersectingEvents from '../events/useIntersectingEvents';

import usePatient from '../patients/usePatient';

import useStateWithInitOverride from '../hooks/useStateWithInitOverride';

import withLazyOpening from '../modal/withLazyOpening';
import PatientPicker from '../patients/PatientPicker';
import {AVAILABILITY_TIMEZONE, weekShifted} from '../../api/availability';
import useQuerySortedWorkSchedule from '../settings/useQuerySortedWorkSchedule';
import nonOverlappingIntersectionQuery from '../../util/interval/nonOverlappingIntersectionQuery';
import isContiguous from '../../util/interval/isContiguous';
import {type AppointmentUpdate} from '../../api/appointments';

import TimeOffSchedulingDialogTab from './TimeOffSchedulingDialogTab';
import EventSchedulingDialogTab from './EventSchedulingDialogTab';
import {useDateTimePickerState} from './useDateTimePickerState';

const Multiline = styled(TextField)({
	overflow: 'auto',
	width: '100%',
});

const usePhone = (patientList) => {
	const patientId = patientList.length === 1 ? patientList[0]._id : '?';

	const deps = [patientId];

	const {found, fields: patient} = usePatient(
		{},
		{filter: {_id: patientId}, projection: {phone: 1}},
		deps,
	);

	const initPhone = found ? patient.phone : '';

	return useStateWithInitOverride(initPhone);
};

const isEqual = (a, b) => a === b;

type InitialPatient = {
	_id: string;
	firstname: string;
	lastname: string;
	phone: string;
};

type OnClose = () => void;
type OnSubmit = (args: AppointmentUpdate) => Promise<{_id: string}>;

type AppointmentDialogProps = {
	readonly open: boolean;
	readonly pending: boolean;
	readonly onClose: OnClose;
	readonly onSubmit: OnSubmit;
	readonly initialBegin: Date;
	readonly initialEnd: Date;
	readonly initialAppointment?: AppointmentDocument;
	readonly initialPatient?: InitialPatient;
};

const AppointmentDialog = ({
	initialBegin,
	initialEnd,
	initialAppointment,
	initialPatient,
	open,
	pending,
	onClose,
	onSubmit,
}: AppointmentDialogProps) => {
	const [tab, setTab] = React.useState('1');

	const onTabChange = (_: React.SyntheticEvent, newValue: string) => {
		setTab(newValue);
	};

	const {loading, value: appointmentDuration} = useSettingCached(
		'appointment-duration',
	);

	return (
		<Dialog open={open}>
			{loading && <LinearProgress />}
			<TabContext value={tab}>
				<DialogTitle>
					<TabList aria-label="lab API tabs example" onChange={onTabChange}>
						<Tab label="Schedule an appointment" value="1" />
						<Tab label="Schedule an event" value="2" />
						<Tab label="Schedule time off" value="3" />
					</TabList>
				</DialogTitle>
				<TabPanel value="1">
					<AppointmentDialogTab
						appointmentDuration={appointmentDuration}
						initialDatetime={initialBegin}
						noInitialTime={
							isDateEqual(addDays(initialBegin, 1), initialEnd) &&
							isDateEqual(initialBegin, startOfDay(initialBegin))
						}
						initialAppointment={initialAppointment}
						initialPatient={initialPatient}
						pending={pending}
						onClose={onClose}
						onSubmit={onSubmit}
					/>
				</TabPanel>
				<TabPanel value="2">
					<EventSchedulingDialogTab
						initialBegin={initialBegin}
						initialEnd={initialEnd}
						initialEvent={initialAppointment}
						pending={pending}
						onClose={onClose}
						onSubmit={onSubmit}
					/>
				</TabPanel>
				<TabPanel value="3">
					<TimeOffSchedulingDialogTab
						initialBegin={initialBegin}
						initialEnd={initialEnd}
						initialEvent={initialAppointment}
						pending={pending}
						onClose={onClose}
						onSubmit={onSubmit}
					/>
				</TabPanel>
			</TabContext>
		</Dialog>
	);
};

type AppointmentSchedulingDialogTabProps = {
	readonly appointmentDuration: number[];
	readonly initialAppointment?: AppointmentDocument;
	readonly initialDatetime: Date;
	readonly noInitialTime: boolean;
	readonly initialPatient?: InitialPatient;
	readonly pending: boolean;
	readonly onClose: OnClose;
	readonly onSubmit: OnSubmit;
};

const AppointmentDialogTab = ({
	appointmentDuration,
	initialAppointment,
	initialPatient,
	initialDatetime,
	noInitialTime,
	pending,
	onClose,
	onSubmit,
}: AppointmentSchedulingDialogTabProps) => {
	const navigate = useNavigate();

	const {value: agendaSlotClickSetsInitialTime} = useSettingCached(
		'agenda-slot-click-sets-initial-time',
	);
	const alwaysNoInitialTime = agendaSlotClickSetsInitialTime === 'off';
	const initialTime = !(alwaysNoInitialTime || noInitialTime);

	const {
		datetime,
		date,
		setDate: onDateChange,
		isValidDate: validDate,
		time,
		setTime: onTimeChange,
		isValidTime: validTime,
	} = useDateTimePickerState(initialDatetime, initialTime);

	const [duration, setDuration] = useStateWithInitOverride<number>(
		// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
		appointmentDuration.includes(initialAppointment?.duration!)
			? initialAppointment!.duration
			: appointmentDuration.length > 0
			? appointmentDuration[0]!
			: 0,
		[initialAppointment, appointmentDuration],
	);
	const [reason, setReason] = useStateWithInitOverride(
		initialAppointment?.reason ?? '',
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

	const appointmentIsInThePast = isBefore(date, startOfToday());
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
		const weekShiftedInterval = weekShifted(AVAILABILITY_TIMEZONE, begin, end);
		const intersectionWithWorkSchedule = Array.from(
			nonOverlappingIntersectionQuery(intervals, weekShiftedInterval),
		);
		const span =
			intersectionWithWorkSchedule.length === 0
				? 0
				: intersectionWithWorkSchedule[
						intersectionWithWorkSchedule.length - 1
				  ]![1] - intersectionWithWorkSchedule[0]![0];
		const measure = Number(end) - Number(begin);
		assert(span <= measure);
		return (
			span < measure || !isContiguous(isEqual, intersectionWithWorkSchedule)
		);
	}, [workSchedule, Number(begin), Number(end)]);

	const createOrUpdateAppointment = async (event) => {
		event.preventDefault();

		if (patientList.length === 1) {
			setPatientError('');
			const args: AppointmentUpdate = {
				datetime,
				duration,
				patient: patientList[0]!,
				phone,
				reason,
			};
			try {
				const res = await onSubmit(args);
				console.log(
					`Appointment #${res._id} ${
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
	const selectedPatientExists =
		patientIsSelected && patientList[0]!._id !== '?';
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
		<>
			<DialogContent>
				<Grid container spacing={3}>
					<Grid item xs={4}>
						<DatePicker
							value={date}
							label="Date"
							slotProps={{
								textField: {
									InputLabelProps: {shrink: true},
									error: !validDate || displayAppointmentIsInThePast,
									helperText: displayAppointmentIsInThePast
										? 'Date dans le passé!'
										: undefined,
								},
							}}
							onChange={onDateChange}
						/>
					</Grid>
					<Grid item xs={4}>
						<TimePicker
							slotProps={{
								textField: {
									InputLabelProps: {shrink: true},
									error: !validTime,
								},
							}}
							label="Time"
							value={time}
							onChange={onTimeChange}
						/>
					</Grid>
					<Grid item xs={4}>
						<FormControl fullWidth>
							<InputLabel htmlFor="duration">Duration</InputLabel>
							<Select
								value={duration}
								inputProps={{
									name: 'duration',
									id: 'duration',
								}}
								onChange={(e) => {
									setDuration(e.target.value as number);
								}}
							>
								{appointmentDuration.map((x) => (
									<MenuItem key={x} value={x}>
										{msToString(x)}
									</MenuItem>
								))}
							</Select>
						</FormControl>
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
							onChange={(e) => {
								setPatientList(e.target.value);
							}}
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
							onChange={(e) => {
								setPhone(e.target.value);
							}}
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
							onChange={(e) => {
								setReason(e.target.value);
							}}
						/>
					</Grid>
				</Grid>
			</DialogContent>

			<DialogActions>
				<CancelButton onClick={onClose} />
				<LoadingButton
					loading={pending}
					disabled={patientList.length !== 1 || !validDate || !validTime}
					color="primary"
					endIcon={<AccessTimeIcon />}
					loadingPosition="end"
					onClick={createOrUpdateAppointment}
				>
					Schedule
				</LoadingButton>
			</DialogActions>
		</>
	);
};

export default withLazyOpening(AppointmentDialog);
