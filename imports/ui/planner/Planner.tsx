import React from 'react';
import {useParams} from 'react-router-dom';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';

import FixedFab from '../button/FixedFab';

import NewAppointmentDialog from '../appointments/NewAppointmentDialog';
import type PropsOf from '../../util/types/PropsOf';

import usePlannerContextState from './usePlannerContextState';
import usePlannerNewAppointmentDialogState from './usePlannerNewAppointmentDialogState';

type Props<C extends React.ElementType> = {
	readonly Calendar: C;
	readonly CalendarProps: PropsOf<C>;
};

const Planner = <C extends React.ElementType>({
	Calendar,
	CalendarProps,
}: Props<C>) => {
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
		initialBegin,
		initialEnd,
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
				initialBegin={initialBegin}
				initialEnd={initialEnd}
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
