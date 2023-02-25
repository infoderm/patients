import {useCallback, useState} from 'react';

import {ALL_WEEK_DAYS} from '../../lib/datetime';

import {useSettingCached} from '../settings/hooks';

const usePlannerState = () => {
	const [displayAllWeekDays, setDisplayAllWeekDays] = useState(false);
	const [showCancelledEvents, setShowCancelledEvents] = useState(false);
	const [showNoShowEvents, setShowNoShowEvents] = useState(false);
	const {value: displayedWeekDaysSetting} = useSettingCached(
		'displayed-week-days',
	);
	const displayedWeekDays = displayAllWeekDays
		? ALL_WEEK_DAYS
		: displayedWeekDaysSetting;

	const toggleDisplayAllWeekDays = useCallback(() => {
		setDisplayAllWeekDays((x) => !x);
	}, [setDisplayAllWeekDays]);

	const toggleShowNoShowEvents = useCallback(() => {
		setShowNoShowEvents((x) => !x);
	}, [setShowNoShowEvents]);

	const toggleShowCancelledEvents = useCallback(() => {
		setShowCancelledEvents((x) => !x);
	}, [setShowCancelledEvents]);

	return {
		showCancelledEvents,
		toggleShowCancelledEvents,
		showNoShowEvents,
		toggleShowNoShowEvents,
		displayAllWeekDays,
		toggleDisplayAllWeekDays,
		displayedWeekDays,
	};
};

export default usePlannerState;
