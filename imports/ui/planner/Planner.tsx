import React from 'react';
import {useParams} from 'react-router-dom';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';

import FixedFab from '../button/FixedFab';

import NewAppointmentDialog from '../appointments/NewAppointmentDialog';
import type PropsOf from '../../lib/types/PropsOf';
import usePlannerContextState from './usePlannerContextState';
import usePlannerNewAppointmentDialogState from './usePlannerNewAppointmentDialogState';

type Props<C> = {
	Calendar: C extends React.ElementType ? C : never;
	CalendarProps?: PropsOf<C extends React.ElementType ? C : never>;
};

const Planner = <C,>({Calendar, CalendarProps}: Props<C>) => {
	const {patientId} = useParams<{patientId?: string}>();

	const {
		showCancelledEvents,
		toggleShowCancelledEvents,
		showNoShowEvents,
		toggleShowNoShowEvents,
		displayAllWeekDays,
		toggleDisplayAllWeekDays,
		displayedWeekDays,
	} = usePlannerContextState();

	const {
		open: newAppointmentDialogOpen,
		onClose: newAppointmentDialogOnClose,
		openOn: onSlotClick,
		initialDatetime: selectedSlot,
		noInitialTime,
	} = usePlannerNewAppointmentDialogState();

	return (
		<>
			<Calendar
				displayedWeekDays={displayedWeekDays}
				showCancelledEvents={showCancelledEvents}
				showNoShowEvents={showNoShowEvents}
				onSlotClick={onSlotClick}
				{...CalendarProps}
			/>
			<NewAppointmentDialog
				noInitialTime={noInitialTime}
				initialDatetime={selectedSlot}
				patientId={patientId}
				open={newAppointmentDialogOpen}
				onClose={newAppointmentDialogOnClose}
			/>
			<FixedFab
				col={4}
				tooltip={displayAllWeekDays ? 'Show work days only' : 'Show all days'}
				color={displayAllWeekDays ? 'primary' : 'default'}
				onClick={toggleDisplayAllWeekDays}
			>
				{displayAllWeekDays ? <VisibilityIcon /> : <VisibilityOffIcon />}
			</FixedFab>
			<FixedFab
				col={5}
				tooltip={showNoShowEvents ? 'Hide no-shows' : 'Show no-shows'}
				color={showNoShowEvents ? 'primary' : 'default'}
				onClick={toggleShowNoShowEvents}
			>
				<PhoneDisabledIcon />
			</FixedFab>
			<FixedFab
				col={6}
				tooltip={
					showCancelledEvents
						? 'Hide cancelled events'
						: 'Show cancelled events'
				}
				color={showCancelledEvents ? 'primary' : 'default'}
				onClick={toggleShowCancelledEvents}
			>
				<AlarmOffIcon />
			</FixedFab>
		</>
	);
};

export default Planner;
