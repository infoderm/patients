import React from 'react';

import {Link} from 'react-router-dom';

import dateFormat from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import isBefore from 'date-fns/isBefore';
import Tooltip from '../accessibility/Tooltip';

const eventBackgroundColor = ({begin, calendar, isCancelled}) => {
	if (isCancelled) return '#ff7961';
	const today = startOfToday();
	const isPast = isBefore(begin, today); // TODO make reactive?
	switch (calendar) {
		case 'appointments':
			return isPast ? '#ccc' : '#fff5d6';
		case 'consultations':
			return '#757de8';
		default:
			return '#eee';
	}
};

const EventFragment = (props) => {
	const {className, event, eventProps} = props;

	const style = {
		backgroundColor: eventBackgroundColor(event),
		color: '#111'
	};

	const time =
		dateFormat(event.begin, 'HH:mm') +
		(event.calendar === 'consultations'
			? ''
			: `-${dateFormat(event.end, 'HH:mm')}`);

	const repr = `${time} ${event.title}`;

	return (
		<Tooltip title={repr} aria-label={repr}>
			<div className={className}>
				<Link to={event.uri} style={style} {...eventProps}>
					{repr}
				</Link>
			</div>
		</Tooltip>
	);
};

export default EventFragment;
