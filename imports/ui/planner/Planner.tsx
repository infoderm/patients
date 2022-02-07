import React, {useState} from 'react';
import {useParams} from 'react-router-dom';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';

import {useSettingCached} from '../settings/hooks';

import FixedFab from '../button/FixedFab';

import NewAppointmentDialog from '../appointments/NewAppointmentDialog';
import {ALL_WEEK_DAYS} from '../../util/datetime';
import PropsOf from '../../util/PropsOf';

interface Props<C> {
	Calendar: C extends React.ElementType ? C : never;
	CalendarProps?: PropsOf<C>;
}

const Planner = <C,>({Calendar, CalendarProps}: Props<C>) => {
	const {patientId} = useParams<{patientId?: string}>();

	const [selectedSlot, setSelectedSlot] = useState(new Date());
	const [noInitialTime, setNoInitialtime] = useState(true);
	const [creatingAppointment, setCreatingAppointment] = useState(false);
	const [displayAllWeekDays, setDisplayAllWeekDays] = useState(false);
	const [showCancelledEvents, setShowCancelledEvents] = useState(false);
	const [showNoShowEvents, setShowNoShowEvents] = useState(false);
	const {value: displayedWeekDays} = useSettingCached('displayed-week-days');

	const onSlotClick = (slot: Date, noInitialTime = true) => {
		console.debug(slot);
		setSelectedSlot(slot);
		setNoInitialtime(noInitialTime);
		setCreatingAppointment(true);
	};

	return (
		<>
			<Calendar
				displayedWeekDays={
					displayAllWeekDays ? ALL_WEEK_DAYS : displayedWeekDays
				}
				showCancelledEvents={showCancelledEvents}
				showNoShowEvents={showNoShowEvents}
				onSlotClick={onSlotClick}
				{...CalendarProps}
			/>
			<NewAppointmentDialog
				noInitialTime={noInitialTime}
				initialDatetime={selectedSlot}
				patientId={patientId}
				open={creatingAppointment}
				onClose={() => {
					setCreatingAppointment(false);
				}}
			/>
			<FixedFab
				col={3}
				tooltip={displayAllWeekDays ? 'Show work days only' : 'Show all days'}
				color={displayAllWeekDays ? 'primary' : 'default'}
				onClick={() => {
					setDisplayAllWeekDays(!displayAllWeekDays);
				}}
			>
				{displayAllWeekDays ? <VisibilityIcon /> : <VisibilityOffIcon />}
			</FixedFab>
			<FixedFab
				col={4}
				tooltip={showNoShowEvents ? 'Hide no-shows' : 'Show no-shows'}
				color={showNoShowEvents ? 'primary' : 'default'}
				onClick={() => {
					setShowNoShowEvents(!showNoShowEvents);
				}}
			>
				<PhoneDisabledIcon />
			</FixedFab>
			<FixedFab
				col={5}
				tooltip={
					showCancelledEvents
						? 'Hide cancelled events'
						: 'Show cancelled events'
				}
				color={showCancelledEvents ? 'primary' : 'default'}
				onClick={() => {
					setShowCancelledEvents(!showCancelledEvents);
				}}
			>
				<AlarmOffIcon />
			</FixedFab>
		</>
	);
};

export default Planner;
