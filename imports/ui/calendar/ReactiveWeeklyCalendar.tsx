import React from 'react';

import {useHistory} from 'react-router-dom';

import dateFormat from 'date-fns/format';
import addWeeks from 'date-fns/addWeeks';
import subWeeks from 'date-fns/subWeeks';

import {useDateFormat} from '../../i18n/datetime';

import useEvents from '../events/useEvents';
import {useSettingCached} from '../../client/settings';

import DayHeader from './DayHeader';
import StaticWeeklyCalendar from './StaticWeeklyCalendar';
import {weekly} from './ranges';

const ReactiveWeeklyCalendar = (props) => {
	const {
		className,
		match,
		displayedWeekDays,
		showCancelledEvents,
		showNoShowEvents,
		onSlotClick,
		...rest
	} = props;

	const year = Number.parseInt(match.params.year, 10);
	const week = Number.parseInt(match.params.week, 10);

	const {value: weekStartsOn} = useSettingCached('week-starts-on');

	const weekOptions = {
		useAdditionalWeekYearTokens: true,
		weekStartsOn,
		firstWeekContainsDate: 1
	};

	const [begin, end] = weekly(year, week, weekOptions);

	console.debug(begin, end);

	const someDayOfWeek = new Date(
		year,
		0,
		weekOptions.firstWeekContainsDate + (week - 1) * 7
	);
	const someDayOfPrevWeek = subWeeks(someDayOfWeek, 1);
	const someDayOfNextWeek = addWeeks(someDayOfWeek, 1);
	const prevWeek = dateFormat(someDayOfPrevWeek, 'YYYY/ww', weekOptions);
	const nextWeek = dateFormat(someDayOfNextWeek, 'YYYY/ww', weekOptions);
	const monthOfWeek = dateFormat(someDayOfWeek, 'yyyy/MM');

	const localizedDateFormat = useDateFormat();

	const title = localizedDateFormat(
		someDayOfWeek,
		"yyyy MMMM / 'Week' w",
		weekOptions
	);
	const baseURL = match.params.patientId
		? `/new/appointment/for/${match.params.patientId}`
		: '/calendar';

	const {results: events} = useEvents(begin, end, {}, {sort: {begin: 1}}, [
		Number(begin),
		Number(end)
	]);

	const history = useHistory();

	const displayedEvents = events.filter(
		(x) =>
			(showCancelledEvents || !x.isCancelled) &&
			(showNoShowEvents || !x.isNoShow)
	);

	return (
		<StaticWeeklyCalendar
			className={className}
			title={title}
			year={year}
			week={week}
			prev={() => history.push(`${baseURL}/week/${prevWeek}`)}
			next={() => history.push(`${baseURL}/week/${nextWeek}`)}
			monthly={() => history.push(`${baseURL}/month/${monthOfWeek}`)}
			events={displayedEvents}
			DayHeader={DayHeader}
			weekOptions={weekOptions}
			displayedWeekDays={displayedWeekDays}
			onSlotClick={onSlotClick}
			{...rest}
		/>
	);
};

export default ReactiveWeeklyCalendar;
