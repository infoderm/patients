import React, {useMemo} from 'react';

import {list} from '@iterable-iterator/list';
import {filter} from '@iterable-iterator/filter';
import {range} from '@iterable-iterator/range';
import {sorted} from '@iterable-iterator/sorted';

import {key} from '@total-order/key';
import {increasing} from '@total-order/primitive';

import {useDaysNames, useWeekStartsOn, WeekStartsOn} from '../../i18n/datetime';

import InputManySetting from './InputManySetting';

const KEY = 'displayed-week-days';

export default function DisplayedWeekDaysSetting({className}) {
	const weekStartsOn = useWeekStartsOn();

	const compare = useMemo(
		() => key(increasing, (x: WeekStartsOn) => (7 + x - weekStartsOn) % 7),
		[weekStartsOn],
	);

	const sort = useMemo(
		() => (items: WeekStartsOn[]) => items.slice().sort(compare),
		[compare],
	);

	const options: WeekStartsOn[] = list(range(7));

	const DAYS = useDaysNames(options);

	const formatDayOfWeek = (i: WeekStartsOn) => DAYS[i];

	const makeSuggestions = (value: WeekStartsOn[]) => (inputValue: string) => ({
		results: sorted(
			compare,
			filter(
				(i: WeekStartsOn) =>
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
			itemToString={(x) => formatDayOfWeek(x)}
			createNewItem={undefined}
			makeSuggestions={makeSuggestions}
			placeholder="Give additional week days"
			sort={sort}
		/>
	);
}
