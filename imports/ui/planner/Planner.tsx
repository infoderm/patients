import React, {useState} from 'react';

import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';

import {useSettingCached} from '../settings/hooks';

import FixedFab from '../button/FixedFab';

import NewAppointmentDialog from '../appointments/NewAppointmentDialog';
import {ALL_WEEK_DAYS} from '../../util/datetime';

const Planner = (props) => {
	const {Calendar, CalendarProps, match} = props;

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
				match={match}
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
				patientId={match.params.patientId}
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
