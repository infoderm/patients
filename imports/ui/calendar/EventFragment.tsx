import React from 'react';

import {Link} from 'react-router-dom';

import dateFormat from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import isBefore from 'date-fns/isBefore';
import {grey} from '@mui/material/colors';
import {type Theme} from '@mui/material/styles';

import Tooltip from '../accessibility/Tooltip';
import color from '../../util/color';

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

type LinkFragmentProps = {
	readonly className: string;
	readonly title: string;
	readonly uri: string;
	readonly style: any;
	readonly eventProps: any;
};

const LinkFragment = React.forwardRef<any, LinkFragmentProps>(
	({className, title, uri, style, eventProps}, ref) => (
		<Tooltip title={title} aria-label={title}>
			<div ref={ref} className={className}>
				<Link to={uri} style={style} {...eventProps}>
					{title}
				</Link>
			</div>
		</Tooltip>
	),
);

type EventFragmentProps = {
	readonly className: string;
	readonly theme: Theme;
	readonly event: any;
	readonly eventProps: any;
};

const AppointmentFragment = React.forwardRef<any, EventFragmentProps>(
	({theme, event, className, eventProps}, ref) => {
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
				ref={ref}
				title={repr}
				className={className}
				uri={event.uri}
				style={style}
				eventProps={eventProps}
			/>
		);
	},
);

const ConsultationFragment = React.forwardRef<any, EventFragmentProps>(
	({theme, event, className, eventProps}, ref) => {
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
				ref={ref}
				title={repr}
				className={className}
				uri={event.uri}
				style={style}
				eventProps={eventProps}
			/>
		);
	},
);

const AvailabilityFragment = React.forwardRef<any, EventFragmentProps>(
	({theme, event, className, eventProps}, ref) => {
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
			<div ref={ref} className={className}>
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
	},
);

const GenericFragment = React.forwardRef<any, EventFragmentProps>(
	({theme, className, event, eventProps}, ref) => {
		const backgroundColor = eventBackgroundColor(theme, event);
		const textColor = theme.palette.getContrastText(backgroundColor);
		const style = {
			backgroundColor,
			color: textColor,
		};

		return (
			<LinkFragment
				ref={ref}
				title={event.calendar}
				className={className}
				uri={event.uri}
				style={style}
				eventProps={eventProps}
			/>
		);
	},
);

const EventFragment = React.forwardRef<any, EventFragmentProps>(
	(props, ref) => {
		switch (props.event.calendar) {
			case 'consultations': {
				return <ConsultationFragment ref={ref} {...props} />;
			}

			case 'appointments': {
				return <AppointmentFragment ref={ref} {...props} />;
			}

			case 'availability': {
				return <AvailabilityFragment ref={ref} {...props} />;
			}

			case 'availability-hidden': {
				return <AvailabilityFragment ref={ref} {...props} />;
			}

			default: {
				return <GenericFragment ref={ref} {...props} />;
			}
		}
	},
);

export default EventFragment;
