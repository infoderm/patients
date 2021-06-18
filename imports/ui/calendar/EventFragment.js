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
			return isPast ? '#997C79' : '#fff5d6';
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

	const text = `${dateFormat(event.begin, 'HH:mm')}-${dateFormat(
		event.end,
		'HH:mm'
	)} ${event.title}`;

	return (
		<Tooltip title={text} aria-label={text}>
			<div className={className}>
				<Link to={event.uri} style={style} {...eventProps}>
					{text}
				</Link>
			</div>
		</Tooltip>
	);
};

export default EventFragment;
