import React from 'react';

import {styled} from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import EventIcon from '@mui/icons-material/Event';

const PREFIX = 'CalendarHeader';

const classes = {
	container: `${PREFIX}-container`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
	[`&.${classes.container}`]: {
		marginBottom: theme.spacing(1),
	},
}));

interface CalendarHeaderProps {
	title?: string;
	next?: () => void;
	prev?: () => void;
	weekly?: () => void;
	monthly?: () => void;
	navigationRole?: 'button' | 'link';
}

const CalendarHeader = ({
	title,
	prev,
	next,
	weekly,
	monthly,
	navigationRole,
}: CalendarHeaderProps) => {
	return (
		<StyledGrid
			container
			justifyContent="flex-start"
			alignItems="center"
			spacing={1}
			className={classes.container}
		>
			<Grid item xs>
				{title && <Typography variant="h6">{title}</Typography>}
			</Grid>
			<Grid item xs container justifyContent="flex-end" spacing={1}>
				<Grid item>
					<Button
						role={navigationRole}
						disabled={!weekly}
						color="primary"
						endIcon={<ViewWeekIcon />}
						onClick={weekly}
					>
						Week
					</Button>
				</Grid>
				<Grid item>
					<Button
						role={navigationRole}
						disabled={!monthly}
						color="primary"
						endIcon={<EventIcon />}
						onClick={monthly}
					>
						Month
					</Button>
				</Grid>
				<Grid item>
					<Button
						role={navigationRole}
						disabled={!prev}
						color="primary"
						startIcon={<SkipPreviousIcon />}
						onClick={prev}
					>
						Prev
					</Button>
				</Grid>
				<Grid item>
					<Button
						role={navigationRole}
						disabled={!next}
						color="primary"
						endIcon={<SkipNextIcon />}
						onClick={next}
					>
						Next
					</Button>
				</Grid>
			</Grid>
		</StyledGrid>
	);
};

export default CalendarHeader;
