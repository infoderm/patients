import React from 'react' ;
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import startOfDay from 'date-fns/start_of_day';
import startOfWeek from 'date-fns/start_of_week';
import endOfWeek from 'date-fns/end_of_week';
import startOfMonth from 'date-fns/start_of_month';
import endOfMonth from 'date-fns/end_of_month';
import differenceInDays from 'date-fns/difference_in_days';
import addDays from 'date-fns/add_days';
import isSameDay from 'date-fns/is_same_day';
import isBefore from 'date-fns/is_before';
import isAfter from 'date-fns/is_after';
import dateFormat from 'date-fns/format';

import {
	list,
	take,
	map,
	range,
	enumerate,
} from '@aureooms/js-itertools';

import calendarRanges from './ranges.js';

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


function ColumnHeader ( { classes , day , row , col } ) {
	return (
		<div
			className={classNames(classes.dayBox,{
				[classes.columnHeader]: true,
				[classes[`col${col}`]]: true,
			})}
		>
			{dateFormat(day, 'dddd')}
		</div>
	) ;
}

function DayBox ( { classes , day , row , col , onSlotClick } ) {
	return (
		<div
			className={classNames(classes.dayBox,{
				[classes[`col${col}`]]: true,
				[classes[`row${row}`]]: true,
			})}
			onClick={e => onSlotClick && onSlotClick(day)}
		>
		</div>
	) ;
}

function* generateDays ( begin , end ) {
	let current = begin ;
	while ( current < end ) {
		yield current;
		current = addDays(current, 1);
	}
}

function* generateDaysProps ( rowSize , begin , end ) {
	const days = generateDays(begin, end);
	for ( const [ith, day] of enumerate(days)) {
		const col = (ith % rowSize) + 1;
		const row = ((ith - col + 1) / rowSize) + 1;
		yield {
			day,
			row,
			col,
		}
	}
}

function createOccupancyMap ( begin , end ) {

	const occupancy = new Map();

	for (const day of generateDays(begin, end)) {
		occupancy.set(dateFormat(day, 'YYYYMMDD'), 0);
	}

	return occupancy;

}

function* generateEventProps ( occupancy , begin , end , maxLines , events ) {

	for ( const event of events ) {

		if ((event.end && isBefore(event.end, begin)) || isAfter(event.begin, end)) continue ;

		const day = dateFormat(event.begin, 'YYYYMMDD');

		const slot = occupancy.get(day) + 1;

		if (slot <= maxLines) {
			yield {
				event,
				day,
				slot,
			};
		}

		occupancy.set(day, slot);

	}

}

function* generateMoreProps ( occupancy , begin , end , maxLines ) {
	for ( const day of generateDays(begin, end) ) {
		const key = dateFormat(day, 'YYYYMMDD');
		const count = occupancy.get(key) - maxLines;
		if ( count > 0 ) yield {
			day: key,
			count,
		} ;
	}
}

function EventFragment ( props ) {
	const {
		className,
		event,
	} = props ;

	return (
		<div className={className}>
			{dateFormat(event.begin, 'HH:mm')} {event.title}
		</div>
	) ;
}

function More ( props ) {

	const {
		className,
		count,
	} = props ;

	return (
		<div className={className}>
			{count} more
		</div>
	) ;

}

class MonthlyCalendarDataGrid extends React.Component {

	constructor ( props ) {
		super(props);
	}

	render ( ) {

		const {
			classes ,
			days ,
			events ,
			mores ,
			DayHeader ,
			onSlotClick ,
			onEventClick ,
		} = this.props ;

		return (
			<div>
				<div className={classes.header}>
					{list(take(days, 7)).map((props, key) => (
						<ColumnHeader
							classes={classes}
							key={key}
							{...props}
						/>
					))}
				</div>
				<div className={classes.grid}>
					{days.map((props, key) => (
						<DayBox
							classes={classes}
							key={key}
							{...props}
							onSlotClick={onSlotClick}
						/>
					))}
					{days.map((props, key) => (
						<DayHeader
							className={classNames(classes.dayHeader,{
								[classes[`col${props.col}`]]: true,
								[classes[`row${props.row}`]]: true,
							})}
							key={key}
							{...props}
						/>
					))}
					{events.map((props, key) => (
						<EventFragment
							className={classNames(classes.event,{
								[classes[`day${props.day}slot${props.slot}`]]: true,
							})}
							key={key}
							{...props}
						/>
					))}
					{mores.map((props, key) => (
						<More
							className={classNames(classes.more,{
								[classes[`day${props.day}more`]]: true,
							})}
							key={key}
							{...props}
						/>
					))}
				</div>
			</div>
		) ;

	}

}

class MonthlyCalendarData extends React.Component {

	constructor ( props ) {
		super(props);
	}

	render ( ) {

		const {
			classes ,
			events ,
			year ,
			month ,
			weekStartsOn ,
			lineHeight,
			maxLines,
			DayHeader,
			onSlotClick,
			onEventClick,
		} = this.props ;

		const weekOptions = {
			weekStartsOn ,
		} ;

		const [begin, end] = calendarRanges.monthly(year, month, weekOptions);

		const days = differenceInDays(end, begin); // should be a multiple of 7

		const rowSize = 7 ;
		const nrows = days / rowSize ;

		const daysProps = [ ...generateDaysProps(rowSize, begin, end)];

		const occupancy = createOccupancyMap(begin, end);
		const eventProps = [ ...generateEventProps(occupancy, begin, end, maxLines - 2, events)];
		const moreProps = [ ...generateMoreProps(occupancy, begin, end, maxLines - 2)];

		const headerHeight = 2 ;

		const gridStyles = {
			header: {
				display: 'grid',
				gridTemplateColumns: 'repeat(7, 1fr)',
				gridTemplateRows: `repeat(${headerHeight}, ${lineHeight})`,
				backgroundColor: '#aaa',
				border: '1px solid #aaa',
				gridGap: '1px',
			} ,
			columnHeader: {
				backgroundColor: '#fff',
				padding: '5px 5px',
				gridColumnEnd: 'span 1',
				gridRowEnd: `span ${headerHeight}`,
			} ,
			grid: {
				display: 'grid',
				gridTemplateColumns: 'repeat(7, 1fr)',
				gridTemplateRows: `repeat(${nrows * maxLines}, ${lineHeight})`,
				backgroundColor: '#aaa',
				border: '1px solid #aaa',
				gridGap: '1px',
			},
			dayHeader: {
				padding: '5px 10px',
				gridColumnEnd: 'span 1',
				gridRowEnd: 'span 1',
			},
			dayBox: {
				backgroundColor: '#fff',
				gridColumnEnd: 'span 1',
				gridRowEnd: `span ${maxLines}`,
				'&:hover': {
					backgroundColor: '#ddd',
				}
			},
			event: {
				gridColumnEnd: 'span 1',
				gridRowEnd: 'span 1',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				paddingLeft: '10px',
			},
			more: {
				gridColumnEnd: 'span 1',
				gridRowEnd: 'span 1',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				paddingLeft: '10px',
				fontWeight: 'bold',
			},
		} ;

		for ( const i of range(1, rowSize+1) ) {
			gridStyles[`col${i}`] = {
				gridColumnStart: i,
			} ;
		}

		for ( const i of range(1, nrows+1) ) {
			gridStyles[`row${i}`] = {
				gridRowStart: (i-1) * maxLines + 1,
			} ;
		}

		for ( const { day , row , col } of daysProps ) {
			const dayId = dateFormat(day, 'YYYYMMDD');
			for ( const j of range(1, maxLines) ) {
				gridStyles[`day${dayId}slot${j}`] = {
					gridColumnStart: col,
					gridRowStart: (row-1) * maxLines + 1 + j,
				} ;
			}
			gridStyles[`day${dayId}more`] = {
				gridColumnStart: col,
				gridRowStart: row * maxLines,
			} ;
		}

		const Grid = withStyles(gridStyles, { withTheme: true })(MonthlyCalendarDataGrid) ;

		return (
			<Grid
				days={daysProps}
				events={eventProps}
				mores={moreProps}
				DayHeader={DayHeader}
				onSlotClick={onSlotClick}
				onEventClick={onEventClick}
			/>
		) ;

			//<div>
				//<div>
					//<div>begin: {begin.toString()}</div>
					//<div>end: {end.toString()}</div>
					//<div>days: {days.toString()}</div>
					//<div>nrows: {nrows.toString()}</div>
				//</div>
			//</div>

	}

}

MonthlyCalendarData.defaultProps = {
	lineHeight: '25px',
	maxLines: 6,
} ;

MonthlyCalendarData.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	year: PropTypes.number.isRequired,
	month: PropTypes.number.isRequired,
	events: PropTypes.array.isRequired,
	weekStartsOn: PropTypes.number,
} ;

export default withStyles(styles, { withTheme: true })(MonthlyCalendarData);
