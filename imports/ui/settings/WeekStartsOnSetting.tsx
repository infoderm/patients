import React from 'react';

import {list} from '@iterable-iterator/list';
import {chain} from '@iterable-iterator/chain';

import {useDaysNames, useLocaleWeekStartsOn} from '../../i18n/datetime';
import {ALL_WEEK_DAYS, type WeekDay} from '../../util/datetime';

import SelectOneSetting from './SelectOneSetting';

const days = ALL_WEEK_DAYS;
const options: Array<'locale' | WeekDay> = list(chain(['locale'], days));

const WeekStartsOnSetting = ({className}) => {
	const weekStartsOn = useLocaleWeekStartsOn();

	const DAYS = useDaysNames(days);

	const optionToString = (x: 'locale' | WeekDay): string =>
		x === 'locale'
			? `${DAYS.get(weekStartsOn)!} (same as locale)`
			: DAYS.get(x)!;

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
