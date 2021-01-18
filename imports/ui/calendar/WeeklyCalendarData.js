import React from 'react';
import PropTypes from 'prop-types';

import {weekly} from './ranges.js';
import CalendarData from './CalendarData.js';

const WeeklyCalendarData = (props) => {
	const {year, week, weekOptions, ...rest} = props;

	const [begin, end] = weekly(year, week, weekOptions);

	return (
		<CalendarData
			year={year}
			begin={begin}
			end={end}
			weekOptions={weekOptions}
			{...rest}
		/>
	);
};

WeeklyCalendarData.defaultProps = {
	maxLines: 24
};

WeeklyCalendarData.propTypes = {
	year: PropTypes.number.isRequired,
	week: PropTypes.number.isRequired,
	weekOptions: PropTypes.object,
	maxLines: PropTypes.number
};

export default WeeklyCalendarData;
