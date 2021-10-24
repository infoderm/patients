import React from 'react';

import {useHistory} from 'react-router-dom';

import dateFormat from 'date-fns/format';
import addWeeks from 'date-fns/addWeeks';
import addDays from 'date-fns/addDays';
import subWeeks from 'date-fns/subWeeks';
import addMilliseconds from 'date-fns/addMilliseconds';
import startOfToday from 'date-fns/startOfToday';
import getDay from 'date-fns/getDay';

import {map} from '@iterable-iterator/map';
import {chain, _chain} from '@iterable-iterator/chain';
import {range} from '@iterable-iterator/range';
import {window} from '@iterable-iterator/window';
import {sorted} from '@iterable-iterator/sorted';
import {filter} from '@iterable-iterator/filter';
import {key} from '@total-order/key';
import {increasing} from '@total-order/date';

import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import setHours from 'date-fns/setHours';
import {useDateFormat} from '../../i18n/datetime';

import useEvents from '../events/useEvents';
import {useSettingCached} from '../../client/settings';

import useAvailability from '../availability/useAvailability';
import {SlotDocument} from '../../api/collection/availability';
import {generateDays, getDayOfWeekModulo} from '../../util/datetime';
import {units as durationUnits} from '../../api/duration';
import useSortedWorkSchedule from '../settings/useSortedWorkSchedule';
import {mod} from '../../util/artithmetic';
import partitionEvents from '../../api/interval/nonOverlappingIntersection';
import {weekly} from './ranges';
import StaticWeeklyCalendar from './StaticWeeklyCalendar';
import DayHeader from './DayHeader';

interface ScheduleSlot {
	beginModuloWeek: number;
	endModuloWeek: number;
}

const prepareAvailability = (
	begin: Date,
	end: Date,
	workSchedule: ScheduleSlot[],
	availability: SlotDocument[],
	onSlotClick: (slot: Date, noInitialTime?: boolean) => void,
) => {
	const weekSlots = window(2, generateDays(begin, addDays(end, 1)));
	const weekStartsOn = getDay(begin);
	const spannedWeeks = Math.ceil(
		differenceInMilliseconds(end, begin) / durationUnits.week,
	);
	const weekAvailability = _chain(
		map(
			(week: number) =>
				map(({beginModuloWeek, endModuloWeek}) => {
					const beginDay = getDayOfWeekModulo(beginModuloWeek);
					const endDay = getDayOfWeekModulo(endModuloWeek);
					const beginMilliseconds = beginModuloWeek % durationUnits.day;
					const endMilliseconds = endModuloWeek % durationUnits.day;
					const beginHours = Math.floor(beginMilliseconds / durationUnits.hour);
					const endHours = Math.floor(endMilliseconds / durationUnits.hour);
					const leftOverBeginMilliseconds =
						beginMilliseconds % durationUnits.hour;
					const leftOverEndMilliseconds = endMilliseconds % durationUnits.hour;
					return [
						addMilliseconds(
							setHours(
								addDays(begin, mod(beginDay - weekStartsOn, 7) + week * 7),
								beginHours,
							),
							leftOverBeginMilliseconds,
						),
						addMilliseconds(
							setHours(
								addDays(begin, mod(endDay - weekStartsOn, 7) + week * 7),
								endHours,
							),
							leftOverEndMilliseconds,
						),
					];
				}, workSchedule),
			range(spannedWeeks),
		),
	);
	const slots = partitionEvents(weekSlots, weekAvailability);
	const events = map((x) => [x.begin, x.end], availability);
	return map(
		([begin, end]) => ({
			calendar: 'availability',
			begin,
			end,
			onClick: () => {
				onSlotClick(begin, false);
			},
		}),
		partitionEvents(slots, events),
	);
};

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
		firstWeekContainsDate: 1 as 1 | 2 | 3 | 4 | 5 | 6 | 7,
	};

	const [begin, end] = weekly(year, week, weekOptions);

	console.debug({begin, end});

	const someDayOfWeek = new Date(
		year,
		0,
		weekOptions.firstWeekContainsDate + (week - 1) * 7,
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
		weekOptions,
	);
	const baseURL = match.params.patientId
		? `/new/appointment/for/${match.params.patientId}`
		: '/calendar';

	const {results: events} = useEvents(begin, end, {}, {sort: {begin: 1}}, [
		Number(begin),
		Number(end),
	]);

	const thisMorning = startOfToday();

	const {results: _availability} = useAvailability(
		begin,
		end,
		{
			end: {$gt: thisMorning},
			weight: 0,
		},
		{sort: {begin: 1}},
		[Number(thisMorning), Number(begin), Number(end)],
	);

	const workSchedule = useSortedWorkSchedule();

	const now = Date.now();

	const availability = map(
		(event) => (event.begin < now ? {...event, begin: now} : event),
		filter(
			({end}) => end > now,
			prepareAvailability(begin, end, workSchedule, _availability, onSlotClick),
		),
	);

	const history = useHistory();

	const displayedEvents = sorted(
		key(increasing, (x) => x.begin),
		chain(
			filter(
				(x) =>
					(showCancelledEvents || !x.isCancelled) &&
					(showNoShowEvents || !x.isNoShow),
				events,
			),
			availability,
		),
	);

	return (
		<StaticWeeklyCalendar
			className={className}
			title={title}
			year={year}
			week={week}
			prev={() => {
				history.push(`${baseURL}/week/${prevWeek}`);
			}}
			next={() => {
				history.push(`${baseURL}/week/${nextWeek}`);
			}}
			monthly={() => {
				history.push(`${baseURL}/month/${monthOfWeek}`);
			}}
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
