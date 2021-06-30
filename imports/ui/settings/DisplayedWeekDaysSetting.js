import React, {useMemo} from 'react';

import {list} from '@iterable-iterator/list';
import {filter} from '@iterable-iterator/filter';
import {range} from '@iterable-iterator/range';

import {key} from '@total-order/key';
import {increasing} from '@total-order/primitive';

import {useDaysNames} from '../../i18n/datetime';

import {useSettingCached} from '../../client/settings';
import InputManySetting from './InputManySetting';

const KEY = 'displayed-week-days';

export default function DisplayedWeekDaysSetting({className}) {
	const {value: weekStartsOn} = useSettingCached('week-starts-on');

	const compare = useMemo(() => {
		return key(increasing, (x) => (7 + x - weekStartsOn) % 7);
	}, [key, increasing, weekStartsOn]);

	const options = list(range(7));

	const DAYS = useDaysNames(options);

	const formatDayOfWeek = (i) => DAYS[i];

	const makeSuggestions = (value) => (inputValue) => ({
		results: list(
			filter(
				(i) =>
					!value.includes(i) &&
					formatDayOfWeek(i).toLowerCase().startsWith(inputValue.toLowerCase()),
				options
			)
		)
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
			sort={(items) => items.sort(compare)}
		/>
	);
}
