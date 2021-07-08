import React, {useMemo} from 'react';

import {list} from '@iterable-iterator/list';
import {range} from '@iterable-iterator/range';

import {key} from '@total-order/key';
import {increasing} from '@total-order/primitive';

import {useDaysNames, useDateFormat} from '../../i18n/datetime';

import {units} from '../../api/duration';

import {useSettingCached} from '../../client/settings';
import InputManySetting from './InputManySetting';

const durationUnits = units;

const KEY = 'work-schedule';

// TODO merge intersecting intervals

export default function DisplayedWeekDaysSetting({className}) {
	const {value: weekStartsOn} = useSettingCached('week-starts-on');

	const compare = useMemo(() => {
		return key(
			increasing,
			({beginModuloWeek}) =>
				(durationUnits.week +
					beginModuloWeek -
					weekStartsOn * durationUnits.day) %
				durationUnits.week
		);
	}, [key, increasing, weekStartsOn, durationUnits.day, durationUnits.week]);

	const sort = useMemo(() => {
		return (items) => items.slice().sort(compare);
	}, [compare]);

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
				c < a || (c <= a && d < b) ? c + d + durationUnits.week : c + d
		};
	};

	const itemToString = (item) => {
		const {beginModuloWeek, endModuloWeek} = item;

		const beginDay = Math.floor(
			(beginModuloWeek % durationUnits.week) / durationUnits.day
		);
		const beginModuloDay = beginModuloWeek % durationUnits.day;
		const beginModuloHour = beginModuloWeek % durationUnits.hour;
		const beginHour = Math.floor(beginModuloDay / durationUnits.hour);
		const beginMinutes = Math.floor(beginModuloHour / durationUnits.minute);
		const endDay = Math.floor(
			(endModuloWeek % durationUnits.week) / durationUnits.day
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

	const itemToKey = (item) => {
		return `${item.beginModuloWeek}-${item.endModuloWeek}`;
	};

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
			sort={sort}
		/>
	);
}
