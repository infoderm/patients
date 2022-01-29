import React from 'react';

import {range} from '@iterable-iterator/range';
import {list} from '@iterable-iterator/list';
import {chain} from '@iterable-iterator/chain';

import {
	useDaysPositions,
	useLocaleFirstWeekContainsDate,
} from '../../i18n/datetime';
import SelectOneSetting from './SelectOneSetting';

const positions = list(range(1, 8));
const options = list(chain(['locale'], positions));

const FirstWeekContainsDateSetting = ({className}) => {
	const firstWeekContainsDate = useLocaleFirstWeekContainsDate();

	const POSITIONS = useDaysPositions(positions);

	const optionToString = (x) =>
		x === 'locale'
			? `${POSITIONS[firstWeekContainsDate]} (same as locale)`
			: POSITIONS[x];

	return (
		<SelectOneSetting
			className={className}
			title="First week contains date"
			label="FirstWeekConstainsDate"
			setting="first-week-contains-date"
			options={options}
			optionToString={optionToString}
		/>
	);
};

export default FirstWeekContainsDateSetting;
