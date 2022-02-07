import React from 'react';

import {scaleOrdinal} from '@visx/scale';

import blue from '@mui/material/colors/blue';
import pink from '@mui/material/colors/pink';
import purple from '@mui/material/colors/purple';
import grey from '@mui/material/colors/grey';

import StackedBarChart from './StackedBarChart';
import useFrequencyStats from './useFrequencyStats';

const Chart = (props) => {
	const {loading, count} = useFrequencyStats();

	const data = loading
		? []
		: Object.entries(count).map(([key, value]) => ({
				key,
				female: value.female ?? 0,
				male: value.male ?? 0,
				other: value.other ?? 0,
				none: value[''] ?? 0,
				undefined: value.undefined ?? 0,
		  }));

	const color = scaleOrdinal({
		domain: ['female', 'male', 'other', 'none', 'undefined'],
		range: [pink[500], blue[500], purple[500], grey[500], grey[600]],
	});

	return <StackedBarChart {...props} data={data} color={color} />;
};

export default Chart;
