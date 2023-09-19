import React from 'react';

import Button from '@mui/material/Button';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import EventIcon from '@mui/icons-material/Event';

import Header from './Header';

type CalendarHeaderProps = {
	readonly title?: string;
	readonly next?: () => void;
	readonly prev?: () => void;
	readonly weekly?: () => void;
	readonly monthly?: () => void;
	readonly navigationRole?: 'button' | 'link';
	readonly actions?: React.ReactNode[];
};

const CalendarHeader = ({
	title,
	prev,
	next,
	weekly,
	monthly,
	navigationRole,
	actions = [],
}: CalendarHeaderProps) => {
	return (
		<Header
			title={title}
			actions={[
				...actions,
				// eslint-disable-next-line react/jsx-key
				<Button
					role={navigationRole}
					disabled={!weekly}
					color="primary"
					endIcon={<ViewWeekIcon />}
					onClick={weekly}
				>
					Week
				</Button>,
				// eslint-disable-next-line react/jsx-key
				<Button
					role={navigationRole}
					disabled={!monthly}
					color="primary"
					endIcon={<EventIcon />}
					onClick={monthly}
				>
					Month
				</Button>,
				// eslint-disable-next-line react/jsx-key
				<Button
					role={navigationRole}
					disabled={!prev}
					color="primary"
					startIcon={<SkipPreviousIcon />}
					onClick={prev}
				>
					Prev
				</Button>,
				// eslint-disable-next-line react/jsx-key
				<Button
					role={navigationRole}
					disabled={!next}
					color="primary"
					endIcon={<SkipNextIcon />}
					onClick={next}
				>
					Next
				</Button>,
			]}
		/>
	);
};

export default CalendarHeader;
