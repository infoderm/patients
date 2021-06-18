import React from 'react';

import {list} from '@iterable-iterator/list';
import {filter} from '@iterable-iterator/filter';
import {range} from '@iterable-iterator/range';

import InputManySetting from './InputManySetting';

const KEY = 'displayed-week-days';

const formatDayOfWeek = (i) => {
	const day = 5 + i;
	// TODO use date-fns
	return new Date(1970, 0, day).toLocaleString('en', {weekday: 'long'});
};

const makeSuggestions = (value) => (inputValue) => ({
	results: list(
		filter(
			(i) =>
				!value.includes(i) &&
				formatDayOfWeek(i).toLowerCase().startsWith(inputValue.toLowerCase()),
			range(7)
		)
	)
});

export default function DisplayedWeekDaysSetting({className}) {
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
			sort={(items) => items.sort()}
		/>
	);
}
