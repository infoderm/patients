import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1)
	},
	leftIcon: {
		marginRight: theme.spacing(1)
	},
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
}));

const CalendarHeader = ({prev, next, weekly, monthly}) => {
	const classes = useStyles();

	return (
		<>
			<Button
				disabled={!prev}
				className={classes.button}
				color="primary"
				onClick={prev}
			>
				<SkipPreviousIcon className={classes.leftIcon} />
				Prev
			</Button>
			<Button
				disabled={!next}
				className={classes.button}
				color="primary"
				onClick={next}
			>
				Next
				<SkipNextIcon className={classes.rightIcon} />
			</Button>
			<Button
				disabled={!weekly}
				className={classes.button}
				color="primary"
				onClick={weekly}
			>
				Weekly
			</Button>
			<Button
				disabled={!monthly}
				className={classes.button}
				color="primary"
				onClick={monthly}
			>
				Monthly
			</Button>
		</>
	);
};

CalendarHeader.propTypes = {
	next: PropTypes.func,
	prev: PropTypes.func,
	weekly: PropTypes.func,
	monthly: PropTypes.func
};

export default CalendarHeader;
