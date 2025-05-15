import React from 'react';
import {useNavigate} from 'react-router-dom';

import {styled} from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LoadingButton from '@mui/lab/LoadingButton';

import useStateWithInitOverride from '../hooks/useStateWithInitOverride';
import CancelButton from '../button/CancelButton';
import TextField from '../input/TextField';

import useIntersectingEvents from '../events/useIntersectingEvents';

import {type AppointmentDocument} from '../../api/collection/appointments';
import {type AppointmentUpdate} from '../../api/appointments';
import { useDateTimePickerState } from './useDateTimePickerState';
import { SlotPicker } from './SlotPicker';

type OnClose = () => void;
type OnSubmit = (args: AppointmentUpdate) => Promise<{_id: string}>;

const Multiline = styled(TextField)({
	overflow: 'auto',
	width: '100%',
});

type EventSchedulingDialogTabProps = {
	readonly initialEvent?: AppointmentDocument;
	readonly initialBegin: Date;
	readonly initialEnd: Date;
	readonly pending: boolean;
	readonly onClose: OnClose;
	readonly onSubmit: OnSubmit;
};

const EventSchedulingDialogTab = ({
	initialEvent,
	initialBegin,
	initialEnd,
	pending,
	onClose,
	onSubmit,
}: EventSchedulingDialogTabProps) => {
	const navigate = useNavigate();

	const begin = useDateTimePickerState(initialBegin, true);
	const end = useDateTimePickerState(initialEnd, true);

	const [title, setTitle] = useStateWithInitOverride(
		initialEvent?.reason ?? '',
		[initialEvent],
	);
	const [description, setDescription] = useStateWithInitOverride(
		initialEvent?.reason ?? '',
		[initialEvent],
	);

	const _id = initialEvent?._id;
	const {results: overlappingEvents} = useIntersectingEvents(
		begin.datetime,
		end.datetime,
		{
			_id: {$ne: _id},
			isCancelled: {$ne: true},
		},
		{limit: 1},
		[_id, begin.datetime, end.datetime],
	);
	const appointmentOverlapsWithAnotherEvent = overlappingEvents.length > 0;

	const createOrUpdateAppointment = async (event) => {
		event.preventDefault();

		const args: AppointmentUpdate = {
			datetime: begin.datetime,
			duration: end.datetime.getTime() - begin.datetime.getTime(),
			reason: description,
		};
		try {
			const res = await onSubmit(args);
			console.log(
				`Appointment #${res._id} ${
					initialEvent ? 'updated' : 'created'
				}.`,
			);
			onClose();
			if (!initialEvent) {
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
					<SlotPicker
						begin={begin}
						end={end}
					/>
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
							value={title}
							margin="normal"
							onChange={(e) => {
								setTitle(e.target.value);
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<Multiline
							multiline
							label="Description de l'évènement"
							placeholder="Description de l'évènement"
							rows={4}
							value={description}
							margin="normal"
							onChange={(e) => {
								setDescription(e.target.value);
							}}
						/>
					</Grid>
				</Grid>
			</DialogContent>

			<DialogActions>
				<CancelButton onClick={onClose} />
				<LoadingButton
					loading={pending}
					disabled={!begin.isValidDate || !begin.isValidTime || !end.isValidTime}
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

export default EventSchedulingDialogTab;
