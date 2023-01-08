import React, {useMemo} from 'react';

import {Link, useNavigate} from 'react-router-dom';

import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';

import {
	useDateFormat,
	useFirstWeekContainsDate,
	useWeekStartsOn,
} from '../../i18n/datetime';

import useEvents from '../events/useEvents';

import type PropsOf from '../../util/PropsOf';
import DayHeader from './DayHeader';
import StaticMonthlyCalendar from './StaticMonthlyCalendar';
import {monthly} from './ranges';

type Props = {
	year: number;
	month: number;
	showCancelledEvents?: boolean;
	showNoShowEvents?: boolean;
} & Omit<
	PropsOf<typeof StaticMonthlyCalendar>,
	'next' | 'prev' | 'weekly' | 'weekOptions' | 'DayHeader' | 'events'
>;

const ReactiveMonthlyCalendar = ({
	year,
	month,
	showCancelledEvents,
	showNoShowEvents,
	...rest
}: Props) => {
	const weekStartsOn = useWeekStartsOn();
	const firstWeekContainsDate = useFirstWeekContainsDate();

	const weekOptions = {
		weekStartsOn,
		firstWeekContainsDate,
	};

	const [begin, end] = monthly(year, month, weekOptions);

	const firstDayOfMonth = new Date(year, month - 1, 1);
	const firstDayOfPrevMonth = subMonths(firstDayOfMonth, 1);
	const firstDayOfNextMonth = addMonths(firstDayOfMonth, 1);

	const localizedDateFormat = useDateFormat();

	const title = localizedDateFormat(firstDayOfMonth, 'yyyy MMMM');

	const {results: events} = useEvents(begin, end, {}, {sort: {begin: 1}}, [
		Number(begin),
		Number(end),
	]);

	const navigate = useNavigate();

	const previousMonth = localizedDateFormat(firstDayOfPrevMonth, 'yyyy/MM');
	const nextMonth = localizedDateFormat(firstDayOfNextMonth, 'yyyy/MM');
	const firstWeekOfMonth = localizedDateFormat(firstDayOfMonth, 'YYYY/ww', {
		useAdditionalWeekYearTokens: true,
	});

	const displayedEvents = events.filter(
		(x) =>
			(showCancelledEvents || !x.isCancelled) &&
			(showNoShowEvents || !x.isNoShow),
	);

	const WeekNumber = useMemo(
		() =>
			({className, day}) =>
				(
					<div className={className}>
						<Link
							to={`../../week/${localizedDateFormat(day, 'YYYY/ww', {
								useAdditionalWeekYearTokens: true,
							})}`}
						>
							{localizedDateFormat(day, 'w')}
						</Link>
					</div>
				),
		[localizedDateFormat],
	);

	return (
		<StaticMonthlyCalendar
			title={title}
			year={year}
			month={month}
			navigationRole="link"
			prev={() => {
				navigate(`../${previousMonth}`);
			}}
			next={() => {
				navigate(`../${nextMonth}`);
			}}
			weekly={() => {
				navigate(`../../week/${firstWeekOfMonth}`);
			}}
			events={displayedEvents}
			DayHeader={DayHeader}
			WeekNumber={WeekNumber}
			weekOptions={weekOptions}
			{...rest}
		/>
	);
};

export default ReactiveMonthlyCalendar;
