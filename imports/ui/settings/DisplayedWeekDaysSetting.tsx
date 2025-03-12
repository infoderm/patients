import React, {useMemo} from 'react';

import {filter} from '@iterable-iterator/filter';
import {sorted} from '@iterable-iterator/sorted';

import {key} from '@total-order/key';
import {increasing} from '@total-order/primitive';

import {
	useDaysNames,
	useWeekStartsOn,
	type WeekStartsOn,
} from '../../i18n/datetime';

import {ALL_WEEK_DAYS, type WeekDay} from '../../util/datetime';
import {mod} from '../../util/arithmetic';

import InputManySetting from './InputManySetting';

const KEY = 'displayed-week-days';

export default function DisplayedWeekDaysSetting({className}) {
	const weekStartsOn = useWeekStartsOn();

	const compare = useMemo(
		() => key(increasing, (x: WeekStartsOn) => mod(x - weekStartsOn, 7)),
		[weekStartsOn],
	);

	const sort = useMemo(
		() => (items: WeekStartsOn[]) => items.slice().sort(compare),
		[compare],
	);

	const options = ALL_WEEK_DAYS;

	const DAYS = useDaysNames(options);

	const formatDayOfWeek = (i: WeekDay) => DAYS.get(i)!;

	const makeSuggestions = (value: WeekDay[]) => (inputValue: string) => ({
		results: sorted(
			compare,
			filter(
				(i: WeekDay) =>
					!value.includes(i) &&
					formatDayOfWeek(i).toLowerCase().startsWith(inputValue.toLowerCase()),
				options,
			),
		),
	});

	return (
		<InputManySetting
			className={className}
			title="Displayed week days"
			label="Week days"
			setting={KEY}
			itemToString={(x: WeekDay) => formatDayOfWeek(x)}
			createNewItem={undefined}
			makeSuggestions={makeSuggestions}
			placeholder="Give additional week days"
			sort={sort}
		/>
	);
}
