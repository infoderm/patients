import React from 'react';
import PropTypes from 'prop-types';

import {range} from '@iterable-iterator/range';
import {list} from '@iterable-iterator/list';

import TabJumper from './TabJumper';

export default function YearJumper({current, ...rest}) {
	const now = new Date();
	const thisyear = now.getFullYear();
	const end = Math.min(thisyear, current + 5) + 1;
	const begin = end - 11;

	const years = range(begin, end);
	const tabs = list(years);

	return <TabJumper tabs={tabs} current={current} {...rest} />;
}

YearJumper.propTypes = {
	current: PropTypes.number.isRequired,
};
