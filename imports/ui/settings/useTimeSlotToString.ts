import {useCallback} from 'react';

import {
	useDateFormat,
	useDaysOfWeek,
	type WeekStartsOn,
} from '../../i18n/datetime';
import {units as durationUnits} from '../../api/duration';

import type ModuloWeekInterval from './ModuloWeekInterval';

type Interval = {
	beginDay: WeekStartsOn;
	beginHour: number;
	beginMinutes: number;
	endDay: WeekStartsOn;
	endHour: number;
	endMinutes: number;
};

const moduloWeekIntervalToInterval = ({
	beginModuloWeek,
	endModuloWeek,
}: ModuloWeekInterval): Interval => {
	const beginDay = Math.floor(
		(beginModuloWeek % durationUnits.week) / durationUnits.day,
	) as WeekStartsOn;
	const beginModuloDay = beginModuloWeek % durationUnits.day;
	const beginModuloHour = beginModuloWeek % durationUnits.hour;
	const beginHour = Math.floor(beginModuloDay / durationUnits.hour);
	const beginMinutes = Math.floor(beginModuloHour / durationUnits.minute);
	const endDay = Math.floor(
		(endModuloWeek % durationUnits.week) / durationUnits.day,
	) as WeekStartsOn;
	const endModuloDay = endModuloWeek % durationUnits.day;
	const endModuloHour = endModuloWeek % durationUnits.hour;
	const endHour = Math.floor(endModuloDay / durationUnits.hour);
	const endMinutes = Math.floor(endModuloHour / durationUnits.minute);

	return {
		beginDay,
		beginHour,
		beginMinutes,
		endDay,
		endHour,
		endMinutes,
	};
};

const useTimeSlotFormat = () => {
	const DAYS = useDaysOfWeek();
	const timeFormat = useDateFormat('p');
	const formatDayOfWeek = useCallback(
		(i: WeekStartsOn) => DAYS.get(i),
		[...DAYS.keys()],
	);

	return useCallback(
		({
			beginDay,
			beginHour,
			beginMinutes,
			endDay,
			endHour,
			endMinutes,
		}: Interval) => {
			const beginDayOfWeek = formatDayOfWeek(beginDay);
			const endDayOfWeek = formatDayOfWeek(endDay);
			const beginTime = timeFormat(new Date(0, 0, 0, beginHour, beginMinutes));
			const endTime = timeFormat(new Date(0, 0, 0, endHour, endMinutes));

			if (endDay === beginDay) {
				return `${beginDayOfWeek} ${beginTime} — ${endTime}`;
			}

			return `${beginDayOfWeek} ${beginTime} — ${endDayOfWeek} ${endTime}`;
		},
		[timeFormat, formatDayOfWeek],
	);
};

const useTimeSlotToString = () => {
	const timeSlotFormat = useTimeSlotFormat();
	return useCallback(
		(interval: ModuloWeekInterval) =>
			timeSlotFormat(moduloWeekIntervalToInterval(interval)),
		[timeSlotFormat],
	);
};

export default useTimeSlotToString;
