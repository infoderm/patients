import React from 'react';

import {range} from '@iterable-iterator/range';
import {list} from '@iterable-iterator/list';

import SelectOneSetting from './SelectOneSetting.js';

const WeekStartsOnSetting = ({className}) => {
	const options = list(range(7));

	const DAYS = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

	const optionToString = (x) => DAYS[x];

	return (
		<SelectOneSetting
			className={className}
			title="First day of the week"
			label="WeekStartsOn"
			setting="week-starts-on"
			options={options}
			optionToString={optionToString}
		/>
	);
};

export default WeekStartsOnSetting;
