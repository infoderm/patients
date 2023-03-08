import assert from 'assert';
import React from 'react';

import {range} from '@iterable-iterator/range';
import {list} from '@iterable-iterator/list';

import TabJumper, {type Props as TabJumperProps} from './TabJumper';

// Waiting for https://github.com/microsoft/TypeScript/pulls/47607
// type Props =  Omit<PropsOf<typeof TabJumper<number>>, 'tabs' | 'number'>;
// Workaround below
type Props = Omit<TabJumperProps<number>, 'tabs'>;

const YearJumper = ({current, ...rest}: Props) => {
	assert(current !== undefined);
	const now = new Date();
	const thisyear = now.getFullYear();
	const end = Math.min(thisyear, current + 5) + 1;
	const begin = end - 11;

	const years = range(begin, end);
	const tabs = list(years);

	return <TabJumper tabs={tabs} current={current} {...rest} />;
};

export default YearJumper;
