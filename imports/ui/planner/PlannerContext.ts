import {createContext} from 'react';
import {ALL_WEEK_DAYS} from '../../util/datetime';

const PlannerContext = createContext({
	showCancelledEvents: false,
	toggleShowCancelledEvents: undefined,
	showNoShowEvents: false,
	toggleShowNoShowEvents: undefined,
	displayAllWeekDays: true,
	toggleDisplayAllWeekDays: undefined,
	displayedWeekDays: ALL_WEEK_DAYS,
});

export default PlannerContext;
