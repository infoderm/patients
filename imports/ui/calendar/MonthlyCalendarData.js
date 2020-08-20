import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {withStyles} from '@material-ui/core/styles';

import differenceInDays from 'date-fns/differenceInDays';
import addDays from 'date-fns/addDays';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import dateFormat from 'date-fns/format';

import {list, take, range, enumerate} from '@aureooms/js-itertools';

import calendarRanges from './ranges.js';

// /calendar/month/2018-10

const styles = (theme) => ({
	button: {
		margin: theme.spacing(1)
	},
	leftIcon: {
		marginRight: theme.spacing(1)
	},
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
});

const ColumnHeader = ({classes, day, col}) => {
	return (
		<div
			className={classNames(classes.dayBox, {
				[classes.columnHeader]: true,
				[classes[`col${col}`]]: true
			})}
		>
			{dateFormat(day, 'iiii')}
		</div>
	);
};

const DayBox = ({classes, day, row, col, onSlotClick}) => {
	return (
		<div
			className={classNames(classes.dayBox, {
				[classes[`col${col}`]]: true,
				[classes[`row${row}`]]: true
			})}
			onClick={() => onSlotClick && onSlotClick(day)}
		/>
	);
};

function* generateDays(begin, end) {
	let current = begin;
	while (current < end) {
		yield current;
		current = addDays(current, 1);
	}
}

function* generateDaysProps(rowSize, begin, end) {
	const days = generateDays(begin, end);
	for (const [ith, day] of enumerate(days)) {
		const col = (ith % rowSize) + 1;
		const row = (ith - col + 1) / rowSize + 1;
		yield {
			day,
			row,
			col
		};
	}
}

function createOccupancyMap(begin, end) {
	const occupancy = new Map();

	for (const day of generateDays(begin, end)) {
		occupancy.set(dateFormat(day, 'yyyyMMdd'), 0);
	}

	return occupancy;
}

function* generateEventProps(occupancy, begin, end, maxLines, events) {
	for (const event of events) {
		if (
			(event.end && isBefore(event.end, begin)) ||
			isAfter(event.begin, end)
		) {
			continue;
		}

		const day = dateFormat(event.begin, 'yyyyMMdd');

		const slot = occupancy.get(day) + 1;

		if (slot <= maxLines) {
			yield {
				event,
				day,
				slot
			};
		}

		occupancy.set(day, slot);
	}
}

function* generateMoreProps(occupancy, begin, end, maxLines) {
	for (const day of generateDays(begin, end)) {
		const key = dateFormat(day, 'yyyyMMdd');
		const count = occupancy.get(key) - maxLines;
		if (count > 0) {
			yield {
				day: key,
				count
			};
		}
	}
}

const EventFragment = (props) => {
	const {className, event} = props;

	return (
		<div className={className}>
			{dateFormat(event.begin, 'HH:mm')} {event.title}
		</div>
	);
};

const More = (props) => {
	const {className, count} = props;

	return <div className={className}>{count} more</div>;
};

class MonthlyCalendarDataGrid extends React.Component {
	render() {
		const {classes, days, events, mores, DayHeader, onSlotClick} = this.props;

		return (
			<div>
				<div className={classes.header}>
					{list(take(days, 7)).map((props, key) => (
						<ColumnHeader key={key} classes={classes} {...props} />
					))}
				</div>
				<div className={classes.grid}>
					{days.map((props, key) => (
						<DayBox
							key={key}
							classes={classes}
							{...props}
							onSlotClick={onSlotClick}
						/>
					))}
					{days.map((props, key) => (
						<DayHeader
							key={key}
							className={classNames(classes.dayHeader, {
								[classes[`col${props.col}`]]: true,
								[classes[`row${props.row}`]]: true
							})}
							{...props}
						/>
					))}
					{events.map((props, key) => (
						<EventFragment
							key={key}
							className={classNames(classes.event, {
								[classes[`day${props.day}slot${props.slot}`]]: true
							})}
							{...props}
						/>
					))}
					{mores.map((props, key) => (
						<More
							key={key}
							className={classNames(classes.more, {
								[classes[`day${props.day}more`]]: true
							})}
							{...props}
						/>
					))}
				</div>
			</div>
		);
	}
}

class MonthlyCalendarData extends React.Component {
	render() {
		const {
			events,
			year,
			month,
			weekStartsOn,
			lineHeight,
			maxLines,
			DayHeader,
			onSlotClick,
			onEventClick
		} = this.props;

		const weekOptions = {
			weekStartsOn
		};

		const [begin, end] = calendarRanges.monthly(year, month, weekOptions);

		const days = differenceInDays(end, begin); // Should be a multiple of 7

		const rowSize = 7;
		const nrows = days / rowSize;

		const daysProps = [...generateDaysProps(rowSize, begin, end)];

		const occupancy = createOccupancyMap(begin, end);
		const eventProps = [
			...generateEventProps(occupancy, begin, end, maxLines - 2, events)
		];
		const moreProps = [
			...generateMoreProps(occupancy, begin, end, maxLines - 2)
		];

		const headerHeight = 2;

		const gridStyles = {
			header: {
				display: 'grid',
				gridTemplateColumns: 'repeat(7, 1fr)',
				gridTemplateRows: `repeat(${headerHeight}, ${lineHeight})`,
				backgroundColor: '#aaa',
				border: '1px solid #aaa',
				gridGap: '1px'
			},
			columnHeader: {
				backgroundColor: '#fff',
				padding: '5px 5px',
				gridColumnEnd: 'span 1',
				gridRowEnd: `span ${headerHeight}`
			},
			grid: {
				display: 'grid',
				gridTemplateColumns: 'repeat(7, 1fr)',
				gridTemplateRows: `repeat(${nrows * maxLines}, ${lineHeight})`,
				backgroundColor: '#aaa',
				border: '1px solid #aaa',
				gridGap: '1px'
			},
			dayHeader: {
				padding: '5px 10px',
				gridColumnEnd: 'span 1',
				gridRowEnd: 'span 1'
			},
			dayBox: {
				backgroundColor: '#fff',
				gridColumnEnd: 'span 1',
				gridRowEnd: `span ${maxLines}`,
				'&:hover': {
					backgroundColor: '#ddd'
				}
			},
			event: {
				gridColumnEnd: 'span 1',
				gridRowEnd: 'span 1',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				paddingLeft: '10px'
			},
			more: {
				gridColumnEnd: 'span 1',
				gridRowEnd: 'span 1',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				paddingLeft: '10px',
				fontWeight: 'bold'
			}
		};

		for (const i of range(1, rowSize + 1)) {
			gridStyles[`col${i}`] = {
				gridColumnStart: i
			};
		}

		for (const i of range(1, nrows + 1)) {
			gridStyles[`row${i}`] = {
				gridRowStart: (i - 1) * maxLines + 1
			};
		}

		for (const {day, row, col} of daysProps) {
			const dayId = dateFormat(day, 'yyyyMMdd');
			for (const j of range(1, maxLines)) {
				gridStyles[`day${dayId}slot${j}`] = {
					gridColumnStart: col,
					gridRowStart: (row - 1) * maxLines + 1 + j
				};
			}

			gridStyles[`day${dayId}more`] = {
				gridColumnStart: col,
				gridRowStart: row * maxLines
			};
		}

		const Grid = withStyles(gridStyles, {withTheme: true})(
			MonthlyCalendarDataGrid
		);

		return (
			<Grid
				days={daysProps}
				events={eventProps}
				mores={moreProps}
				DayHeader={DayHeader}
				onSlotClick={onSlotClick}
				onEventClick={onEventClick}
			/>
		);

		// <div>
		// <div>
		// <div>begin: {begin.toString()}</div>
		// <div>end: {end.toString()}</div>
		// <div>days: {days.toString()}</div>
		// <div>nrows: {nrows.toString()}</div>
		// </div>
		// </div>
	}
}

MonthlyCalendarData.defaultProps = {
	lineHeight: '25px',
	maxLines: 6
};

MonthlyCalendarData.propTypes = {
	year: PropTypes.number.isRequired,
	month: PropTypes.number.isRequired,
	events: PropTypes.array.isRequired,
	weekStartsOn: PropTypes.number,
	maxLines: PropTypes.number,
	lineHeight: PropTypes.any
};

export default withStyles(styles, {withTheme: true})(MonthlyCalendarData);
