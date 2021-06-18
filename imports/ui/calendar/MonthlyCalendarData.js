import React from 'react';
import PropTypes from 'prop-types';

import {monthly} from './ranges';
import CalendarData from './CalendarData';

const MonthlyCalendarData = (props) => {
	const {year, month, weekOptions, ...rest} = props;

	const [begin, end] = monthly(year, month, weekOptions);

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

MonthlyCalendarData.defaultProps = {
	maxLines: 6
};

MonthlyCalendarData.propTypes = {
	year: PropTypes.number.isRequired,
	month: PropTypes.number.isRequired,
	weekOptions: PropTypes.object,
	maxLines: PropTypes.number
};

export default MonthlyCalendarData;
