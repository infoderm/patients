import React from 'react';

import {Link} from 'react-router-dom';

import dateFormat from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import isBefore from 'date-fns/isBefore';
import {grey} from '@mui/material/colors';
import {type Theme} from '@mui/material/styles';

import Tooltip from '../accessibility/Tooltip';
import color from '../../lib/color';

const themedColor = (theme: Theme, tint: string) =>
	color(theme.palette.background.paper).mix(tint, 0.5).toRgbString();

const eventBackgroundColor = (theme: Theme, {begin, calendar, isCancelled}) => {
	if (isCancelled) return themedColor(theme, '#ff7961');
	const today = startOfToday();
	const isPast = isBefore(begin, today); // TODO make reactive?
	switch (calendar) {
		case 'appointments': {
			return themedColor(theme, isPast ? grey[400] : '#eea');
		}

		case 'consultations': {
			return themedColor(theme, '#757de8');
		}

		case 'availability': {
			return themedColor(theme, '#a5f8ad');
		}

		default: {
			return themedColor(theme, grey[200]);
		}
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

type EventFragmentProps = {
	readonly className: string;
	readonly theme: Theme;
	readonly event: any;
	readonly eventProps: any;
};

const AppointmentFragment = ({
	theme,
	event,
	className,
	eventProps,
}: EventFragmentProps) => {
	const time = `${dateFormat(event.begin, 'HH:mm')}-${dateFormat(
		event.end,
		'HH:mm',
	)}`;
	const repr = `${time} ${event.title}`;
	const backgroundColor = eventBackgroundColor(theme, event);
	const textColor = theme.palette.getContrastText(backgroundColor);
	const style = {
		backgroundColor,
		color: textColor,
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

const ConsultationFragment = ({
	theme,
	event,
	className,
	eventProps,
}: EventFragmentProps) => {
	const time = dateFormat(event.begin, 'HH:mm');
	const repr = `${time} ${event.title}`;
	const backgroundColor = eventBackgroundColor(theme, event);
	const textColor = theme.palette.getContrastText(backgroundColor);
	const style = {
		backgroundColor,
		color: textColor,
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

const AvailabilityFragment = ({
	theme,
	event,
	className,
	eventProps,
}: EventFragmentProps) => {
	const backgroundColor = eventBackgroundColor(theme, event);
	const textColor = theme.palette.getContrastText(backgroundColor);
	const style = {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: 'bold',
		cursor: event.onClick && 'pointer',
		backgroundColor,
		color: textColor,
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

const GenericFragment = ({
	theme,
	className,
	event,
	eventProps,
}: EventFragmentProps) => {
	const backgroundColor = eventBackgroundColor(theme, event);
	const textColor = theme.palette.getContrastText(backgroundColor);
	const style = {
		backgroundColor,
		color: textColor,
	};

	return (
		<LinkFragment
			title={event.calendar}
			className={className}
			uri={event.uri}
			style={style}
			eventProps={eventProps}
		/>
	);
};

const EventFragment = (props: EventFragmentProps) => {
	switch (props.event.calendar) {
		case 'consultations': {
			return <ConsultationFragment {...props} />;
		}

		case 'appointments': {
			return <AppointmentFragment {...props} />;
		}

		case 'availability': {
			return <AvailabilityFragment {...props} />;
		}

		case 'availability-hidden': {
			return <AvailabilityFragment {...props} />;
		}

		default: {
			return <GenericFragment {...props} />;
		}
	}
};

export default EventFragment;
