import React from 'react';

import {Link} from 'react-router-dom';

import dateFormat from 'date-fns/format';

import {useDateFormat} from '../../i18n/datetime';

type Props = {
	readonly className?: string;
	readonly day: Date;
	readonly isFirstDisplayedDayOfMonth?: boolean;
};

const DayHeader = ({className, day, isFirstDisplayedDayOfMonth}: Props) => {
	const localizedDateFormat = useDateFormat();
	const displayFormat = isFirstDisplayedDayOfMonth ? 'MMM d' : 'd';
	return (
		<div className={className}>
			<Link to={`/calendar/day/${dateFormat(day, 'yyyy-MM-dd')}`}>
				{localizedDateFormat(day, displayFormat)}
			</Link>
		</div>
	);
};

export default DayHeader;
