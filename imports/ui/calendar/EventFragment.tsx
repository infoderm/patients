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
		case 'availability':
			return '#a5f8ad';
		default:
			return '#eee';
	}
};

const LinkFragment = ({className, title, uri, style, eventProps}) => (
	<Tooltip title={title} aria-label={title}>
		<div className={className}>
			<Link to={uri} style={style} {...eventProps}>
				{title}
			</Link>
		</div>
	</Tooltip>
);

const AppointmentFragment = ({event, className, eventProps}) => {
	const time = `${dateFormat(event.begin, 'HH:mm')}-${dateFormat(
		event.end,
		'HH:mm',
	)}`;
	const repr = `${time} ${event.title}`;
	const style = {
		backgroundColor: eventBackgroundColor(event),
		color: '#111',
	};
	return (
		<LinkFragment
			title={repr}
			className={className}
			uri={event.uri}
			style={style}
			eventProps={eventProps}
		/>
	);
};

const ConsultationFragment = ({event, className, eventProps}) => {
	const time = dateFormat(event.begin, 'HH:mm');
	const repr = `${time} ${event.title}`;
	const style = {
		backgroundColor: eventBackgroundColor(event),
		color: '#111',
	};
	return (
		<LinkFragment
			title={repr}
			className={className}
			uri={event.uri}
			style={style}
			eventProps={eventProps}
		/>
	);
};

const AvailabilityFragment = ({event, className, eventProps}) => {
	const style = {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: 'bold',
		cursor: 'pointer',
		backgroundColor: eventBackgroundColor(event),
		color: '#111',
	};
	const time = `${dateFormat(event.begin, 'HH:mm')} - ${dateFormat(
		event.end,
		'HH:mm',
	)}`;
	const title = time;
	const ariaLabel = `Schedule an appointment starting on ${dateFormat(
		event.begin,
		'PPPPpppp',
	)}`;
	return (
		<div className={className}>
			<span
				style={style}
				role="button"
				aria-label={ariaLabel}
				onClick={event.onClick}
				{...eventProps}
			>
				{title}
			</span>
		</div>
	);
};

interface Props {
	className: string;
	event: any;
	eventProps: any;
}

const EventFragment = (props: Props) => {
	switch (props.event.calendar) {
		case 'consultations':
			return <ConsultationFragment {...props} />;
		case 'appointments':
			return <AppointmentFragment {...props} />;
		case 'availability':
			return <AvailabilityFragment {...props} />;
		default:
			break;
	}

	const {className, event, eventProps} = props;

	const style = {
		backgroundColor: eventBackgroundColor(event),
		color: '#111',
	};

	return (
		<LinkFragment
			title={props.event.calendar}
			className={className}
			uri={event.uri}
			style={style}
			eventProps={eventProps}
		/>
	);
};

export default EventFragment;
