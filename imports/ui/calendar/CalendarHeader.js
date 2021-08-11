import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import EventIcon from '@material-ui/icons/Event';

import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	container: {
		marginBottom: theme.spacing(1),
	},
}));

const CalendarHeader = ({title, prev, next, weekly, monthly}) => {
	const classes = useStyles();

	return (
		<Grid
			container
			justify="flex-start"
			alignItems="center"
			spacing={1}
			className={classes.container}
		>
			<Grid item xs>
				{title && <Typography variant="h6">{title}</Typography>}
			</Grid>
			<Grid item xs container justify="flex-end" spacing={1}>
				<Grid item>
					<Button
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

CalendarHeader.propTypes = {
	title: PropTypes.string,
	next: PropTypes.func,
	prev: PropTypes.func,
	weekly: PropTypes.func,
	monthly: PropTypes.func,
};

export default CalendarHeader;
