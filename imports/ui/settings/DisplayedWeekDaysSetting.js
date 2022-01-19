import React, {useMemo} from 'react';

import {list} from '@iterable-iterator/list';
import {filter} from '@iterable-iterator/filter';
import {range} from '@iterable-iterator/range';
import {sorted} from '@iterable-iterator/sorted';

import {key} from '@total-order/key';
import {increasing} from '@total-order/primitive';

import {useDaysNames} from '../../i18n/datetime';

import {useSettingCached} from './hooks';
import InputManySetting from './InputManySetting';

const KEY = 'displayed-week-days';

export default function DisplayedWeekDaysSetting({className}) {
	const {value: weekStartsOn} = useSettingCached('week-starts-on');

	const compare = useMemo(
		() => key(increasing, (x) => (7 + x - weekStartsOn) % 7),
		[weekStartsOn],
	);

	const sort = useMemo(() => (items) => items.slice().sort(compare), [compare]);

	const options = list(range(7));

	const DAYS = useDaysNames(options);

	const formatDayOfWeek = (i) => DAYS[i];

	const makeSuggestions = (value) => (inputValue) => ({
		results: sorted(
			compare,
			filter(
				(i) =>
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
