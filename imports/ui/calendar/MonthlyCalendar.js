import React from 'react' ;
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import MonthlyCalendarData from './MonthlyCalendarData.js';

// /calendar/month/2018-10

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	leftIcon: {
		marginRight: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
});


class MonthlyCalendar extends React.Component {

	constructor ( props ) {
		super(props);
	}

	render ( ) {

		const {
			classes ,
			events ,
			next ,
			prev ,
			year ,
			month ,
			weekStartsOn ,
			DayHeader ,
			onSlotClick ,
			onEventClick ,
		} = this.props ;

		return (
			<div>
				{ prev &&
					<Button
						variant="contained"
						className={classes.button}
						color="primary"
						onClick={prev}
					>
						<SkipPreviousIcon className={classes.leftIcon}/>
						Prev
					</Button>
				}
				{ next &&
					<Button
						variant="contained"
						className={classes.button}
						color="primary"
						onClick={next}
					>
						Next
						<SkipNextIcon className={classes.rightIcon}/>
					</Button>
				}
				<MonthlyCalendarData
					year={year}
					month={month}
					events={events}
					weekStartsOn={weekStartsOn}
					DayHeader={DayHeader}
					onSlotClick={onSlotClick}
					onEventClick={onEventClick}
				/>
			</div>
		) ;
	}

}

MonthlyCalendar.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	year: PropTypes.number.isRequired,
	month: PropTypes.number.isRequired,
	events: PropTypes.array.isRequired,
	next: PropTypes.func,
	prev: PropTypes.func,
	weekStartsOn: PropTypes.number,
} ;

export default withStyles(styles, { withTheme: true })(MonthlyCalendar);
