import React from 'react';

import {range} from '@iterable-iterator/range';
import {list} from '@iterable-iterator/list';
import {chain} from '@iterable-iterator/chain';

import {useDaysNames, useLocaleWeekStartsOn} from '../../i18n/datetime';
import SelectOneSetting from './SelectOneSetting';

const days = list(range(7));
const options = list(chain(['locale'], days));

const WeekStartsOnSetting = ({className}) => {
	const weekStartsOn = useLocaleWeekStartsOn();

	const DAYS = useDaysNames(days);

	const optionToString = (x) =>
		x === 'locale' ? `${DAYS[weekStartsOn]} (same as locale)` : DAYS[x];

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
