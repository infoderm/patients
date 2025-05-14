import React from 'react';
import {useNavigate} from 'react-router-dom';

import {styled} from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import {DatePicker, DesktopTimePicker as TimePicker} from '@mui/x-date-pickers';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LoadingButton from '@mui/lab/LoadingButton';

import dateFormat from 'date-fns/format';
import isValid from 'date-fns/isValid';
import isBefore from 'date-fns/isBefore';
import startOfToday from 'date-fns/startOfToday';

import useStateWithInitOverride from '../hooks/useStateWithInitOverride';
import CancelButton from '../button/CancelButton';
import TextField from '../input/TextField';

import useIntersectingEvents from '../events/useIntersectingEvents';

import {type AppointmentDocument} from '../../api/collection/appointments';
import {type AppointmentUpdate} from '../../api/appointments';

type OnClose = () => void;
type OnSubmit = (args: AppointmentUpdate) => Promise<{_id: string}>;

const Multiline = styled(TextField)({
	overflow: 'auto',
	width: '100%',
});

const serializeDate = (datetime: Date) => dateFormat(datetime, 'yyyy-MM-dd');
const serializeTime = (datetime: Date) => dateFormat(datetime, 'HH:mm');
const unserializeDate = (date: string) => new Date(date);
const unserializeDatetime = (date: string, time: string) =>
	new Date(`${date}T${time}`);
const unserializeTime = (time: string) =>
	unserializeDatetime('1970-01-01', time);

type TimeOffSchedulingDialogTabProps = {
	readonly initialAppointment?: AppointmentDocument;
	readonly initialDatetime: Date;
	readonly noInitialTime: boolean;
	readonly pending: boolean;
	readonly onClose: OnClose;
	readonly onSubmit: OnSubmit;
};

const TimeOffSchedulingDialogTab = ({
	initialAppointment,
	initialDatetime,
	noInitialTime,
	pending,
	onClose,
	onSubmit,
}: TimeOffSchedulingDialogTabProps) => {
	const navigate = useNavigate();

	const [date, setDate] = useStateWithInitOverride(
		serializeDate(initialDatetime),
	);
	const [validDate, setValidDate] = useStateWithInitOverride(
		isValid(initialDatetime),
	);
	const [time, setTime] = useStateWithInitOverride(
		noInitialTime ? '' : serializeTime(initialDatetime),
	);
	const [endTime, setEndTime] = useStateWithInitOverride(
		noInitialTime ? '' : serializeTime(initialDatetime),
	);
	const [validTime, setValidTime] = useStateWithInitOverride(
		!noInitialTime && isValid(initialDatetime),
	);
	const [validEndTime, setValidEndTime] = useStateWithInitOverride(
		!noInitialTime && isValid(initialDatetime),
	);
	const [reason, setReason] = useStateWithInitOverride(
		initialAppointment?.reason ?? '',
		[initialAppointment],
	);

	const datetime = unserializeDatetime(date, time);
	const appointmentIsInThePast = isBefore(
		unserializeDate(date),
		startOfToday(),
	);
	const displayAppointmentIsInThePast = appointmentIsInThePast;

	const _id = initialAppointment?._id;
	const begin = datetime;
	const end = unserializeDatetime(date, endTime);
	const {results: overlappingEvents} = useIntersectingEvents(
		begin,
		end,
		{
			_id: {$ne: _id},
			isCancelled: {$ne: true},
		},
		{limit: 1},
		[_id, Number(begin), Number(end)],
	);
	const appointmentOverlapsWithAnotherEvent = overlappingEvents.length > 0;

	const createOrUpdateAppointment = async (event) => {
		event.preventDefault();

		const args: AppointmentUpdate = {
			datetime,
			duration: end.getTime() - begin.getTime(),
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
	};

	return (
		<>
			<DialogContent>
				<Grid container spacing={3}>
					<Grid item xs={4}>
						<DatePicker
							value={unserializeDate(date)}
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
							onChange={(pickedDatetime) => {
								if (isValid(pickedDatetime)) {
									setDate(serializeDate(pickedDatetime!));
									setValidDate(true);
								} else {
									setValidDate(false);
								}
							}}
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
							label="Begin"
							value={time === '' ? null : unserializeTime(time)}
							onChange={(pickedDatetime) => {
								if (isValid(pickedDatetime)) {
									setTime(serializeTime(pickedDatetime!));
									setValidTime(true);
								} else {
									setValidTime(false);
								}
							}}
						/>
					</Grid>
					<Grid item xs={4}>
						<TimePicker
							slotProps={{
								textField: {
									InputLabelProps: {shrink: true},
									error: !validEndTime,
								},
							}}
							label="End"
							value={endTime === '' ? null : unserializeTime(endTime)}
							onChange={(pickedDatetime) => {
								if (isValid(pickedDatetime)) {
									setEndTime(serializeTime(pickedDatetime!));
									setValidEndTime(true);
								} else {
									setValidEndTime(false);
								}
							}}
						/>
					</Grid>
					{appointmentOverlapsWithAnotherEvent && (
						<Grid item xs={12}>
							<Alert severity="warning">
								<AlertTitle>Attention</AlertTitle>
								Cet évènement <strong>chevauche un autre évènement</strong>!
							</Alert>
						</Grid>
					)}
					<Grid item xs={12}>
						<Multiline
							multiline
							label="Titre de l'évènement"
							placeholder="Titre de l'évènement"
							rows={1}
							value={reason}
							margin="normal"
							onChange={(e) => {
								setReason(e.target.value);
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<Multiline
							multiline
							label="Description de l'évènement"
							placeholder="Description de l'évènement"
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
					disabled={!validDate || !validTime || !validEndTime}
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

export default TimeOffSchedulingDialogTab;
