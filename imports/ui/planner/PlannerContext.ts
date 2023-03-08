import {createContext} from 'react';
import {ALL_WEEK_DAYS, type WeekDay} from '../../lib/datetime';

type Context = {
	showCancelledEvents: boolean;
	toggleShowCancelledEvents?: () => void;
	showNoShowEvents: boolean;
	toggleShowNoShowEvents?: () => void;
	displayAllWeekDays: boolean;
	toggleDisplayAllWeekDays?: () => void;
	displayedWeekDays: readonly WeekDay[];
};

const PlannerContext = createContext<Context>({
	showCancelledEvents: false,
	toggleShowCancelledEvents: undefined,
	showNoShowEvents: false,
	toggleShowNoShowEvents: undefined,
	displayAllWeekDays: true,
	toggleDisplayAllWeekDays: undefined,
	displayedWeekDays: ALL_WEEK_DAYS,
});

export default PlannerContext;
