import React, {useMemo} from 'react';

import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';
import {range} from '@iterable-iterator/range';

import {useDaysNames, useDateFormat} from '../../i18n/datetime';

import {units as durationUnits} from '../../api/duration';

import simplifyUnion from '../../lib/interval/simplifyUnion';
import InputManySetting from './InputManySetting';
import useWorkScheduleSort from './useWorkScheduleSort';

const KEY = 'work-schedule';

const slotToInterval = ({beginModuloWeek, endModuloWeek}) => [
	beginModuloWeek,
	endModuloWeek,
];
const intervalToSlot = ([beginModuloWeek, endModuloWeek]) => ({
	beginModuloWeek,
	endModuloWeek,
});

export default function WorkScheduleSetting({className}) {
	const sort = useWorkScheduleSort();
	const sortAndMerge = useMemo(
		() => (values) =>
			Array.from(
				map(intervalToSlot, simplifyUnion(map(slotToInterval, sort(values)))),
			),
		[sort],
	);

	const options = list(range(7));

	const DAYS = useDaysNames(options);
	const timeFormat = useDateFormat('p');

	const formatDayOfWeek = (i) => DAYS[i];

	const createNewItem = (x) => {
		const parts = x.split(' ');
		if (parts.length !== 4) return undefined;
		const [beginDay, beginModuloDay, endDay, endModuloDay] = parts;
		const a = Number.parseInt(beginDay, 10) * durationUnits.day;
		const b = Number.parseFloat(beginModuloDay) * durationUnits.hour;
		const c = Number.parseInt(endDay, 10) * durationUnits.day;
		const d = Number.parseFloat(endModuloDay) * durationUnits.hour;
		if (!Number.isFinite(a)) return undefined;
		if (!Number.isFinite(b)) return undefined;
		if (!Number.isFinite(c)) return undefined;
		if (!Number.isFinite(d)) return undefined;
		return {
			beginModuloWeek: a + b,
			endModuloWeek:
				c < a || (c <= a && d < b) ? c + d + durationUnits.week : c + d,
		};
	};

	const itemToString = (item) => {
		const {beginModuloWeek, endModuloWeek} = item;

		const beginDay = Math.floor(
			(beginModuloWeek % durationUnits.week) / durationUnits.day,
		);
		const beginModuloDay = beginModuloWeek % durationUnits.day;
		const beginModuloHour = beginModuloWeek % durationUnits.hour;
		const beginHour = Math.floor(beginModuloDay / durationUnits.hour);
		const beginMinutes = Math.floor(beginModuloHour / durationUnits.minute);
		const endDay = Math.floor(
			(endModuloWeek % durationUnits.week) / durationUnits.day,
		);
		const endModuloDay = endModuloWeek % durationUnits.day;
		const endModuloHour = endModuloWeek % durationUnits.hour;
		const endHour = Math.floor(endModuloDay / durationUnits.hour);
		const endMinutes = Math.floor(endModuloHour / durationUnits.minute);

		const beginDayOfWeek = formatDayOfWeek(beginDay);
		const endDayOfWeek = formatDayOfWeek(endDay);
		const beginTime = timeFormat(new Date(0, 0, 0, beginHour, beginMinutes));
		const endTime = timeFormat(new Date(0, 0, 0, endHour, endMinutes));

		if (endDay === beginDay) {
			return `${beginDayOfWeek} ${beginTime} — ${endTime}`;
		}

		return `${beginDayOfWeek} ${beginTime} — ${endDayOfWeek} ${endTime}`;
	};

	const itemToKey = (item) => `${item.beginModuloWeek}-${item.endModuloWeek}`;

	return (
		<InputManySetting
			className={className}
			title="Work schedule"
			label="Time intervals"
			setting={KEY}
			itemToKey={itemToKey}
			itemToString={itemToString}
			createNewItem={createNewItem}
			placeholder="Give additional time slots"
			sort={sortAndMerge}
		/>
	);
}
