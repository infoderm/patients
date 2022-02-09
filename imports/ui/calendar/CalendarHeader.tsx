import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import EventIcon from '@mui/icons-material/Event';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
	container: {
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
	const classes = useStyles();

	return (
		<Grid
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
		</Grid>
	);
};

export default CalendarHeader;
