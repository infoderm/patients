import React from 'react';

import {range} from '@iterable-iterator/range';
import {list} from '@iterable-iterator/list';

import {useDaysNames} from '../../i18n/datetime';
import SelectOneSetting from './SelectOneSetting';

const WeekStartsOnSetting = ({className}) => {
	const options = list(range(7));

	const DAYS = useDaysNames(options);

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
