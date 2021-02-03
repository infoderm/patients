import React from 'react';

import {scaleOrdinal} from '@visx/scale';

import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import grey from '@material-ui/core/colors/grey';

import StackedBarChart from './StackedBarChart.js';
import useFrequencyStats from './useFrequencyStats.js';

const Chart = (props) => {
	const {loading, count} = useFrequencyStats();

	const data = loading
		? []
		: Object.entries(count).map(([key, value]) => ({
				key,
				female: value.female ?? 0,
				male: value.male ?? 0,
				other: value.other ?? 0,
				none: value[''] ?? 0
		  }));

	const color = scaleOrdinal({
		domain: ['female', 'male', 'other', 'none'],
		range: [pink[500], blue[500], purple[500], grey[500]]
	});

	console.debug(data);

	return <StackedBarChart {...props} data={data} color={color} />;
};

export default Chart;
