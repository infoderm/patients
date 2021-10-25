import React, {useMemo} from 'react';

import {Link, useHistory} from 'react-router-dom';

import dateFormat from 'date-fns/format';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';

import {useDateFormat} from '../../i18n/datetime';

import useEvents from '../events/useEvents';
import {useSettingCached} from '../../client/settings';

import DayHeader from './DayHeader';
import StaticMonthlyCalendar from './StaticMonthlyCalendar';
import {monthly} from './ranges';

const ReactiveMonthlyCalendar = (props) => {
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
	const month = Number.parseInt(match.params.month, 10);

	const {value: weekStartsOn} = useSettingCached('week-starts-on');

	const weekOptions = {
		weekStartsOn,
	};

	const [begin, end] = monthly(year, month, weekOptions);

	console.debug({begin, end});

	const firstDayOfMonth = new Date(year, month - 1, 1);
	const firstDayOfPrevMonth = subMonths(firstDayOfMonth, 1);
	const firstDayOfNextMonth = addMonths(firstDayOfMonth, 1);

	const localizedDateFormat = useDateFormat();

	const title = localizedDateFormat(firstDayOfMonth, 'yyyy MMMM');
	const baseURL = match.params.patientId
		? `/new/appointment/for/${match.params.patientId}`
		: '/calendar';

	const {results: events} = useEvents(begin, end, {}, {sort: {begin: 1}}, [
		Number(begin),
		Number(end),
	]);

	const history = useHistory();

	const previousMonth = dateFormat(firstDayOfPrevMonth, 'yyyy/MM');
	const nextMonth = dateFormat(firstDayOfNextMonth, 'yyyy/MM');
	const firstWeekOfMonth = dateFormat(firstDayOfMonth, 'yyyy/ww');

	const displayedEvents = events.filter(
		(x) =>
			(showCancelledEvents || !x.isCancelled) &&
			(showNoShowEvents || !x.isNoShow),
	);

	const WeekNumber = useMemo(
		() =>
			({className, day, weekOptions}) =>
				(
					<div className={className}>
						<Link
							to={`${baseURL}/week/${dateFormat(day, 'yyyy/ww', weekOptions)}`}
						>
							{dateFormat(day, 'w', weekOptions)}
						</Link>
					</div>
				),
		[baseURL],
	);

	return (
		<StaticMonthlyCalendar
			className={className}
			title={title}
			year={year}
			month={month}
			prev={() => {
				history.push(`${baseURL}/month/${previousMonth}`);
			}}
			next={() => {
				history.push(`${baseURL}/month/${nextMonth}`);
			}}
			weekly={() => {
				history.push(`${baseURL}/week/${firstWeekOfMonth}`);
			}}
			events={displayedEvents}
			DayHeader={DayHeader}
			WeekNumber={WeekNumber}
			weekOptions={weekOptions}
			displayedWeekDays={displayedWeekDays}
			onSlotClick={onSlotClick}
			{...rest}
		/>
	);
};

export default ReactiveMonthlyCalendar;
