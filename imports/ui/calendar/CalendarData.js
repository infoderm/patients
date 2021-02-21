import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import differenceInDays from 'date-fns/differenceInDays';
import addDays from 'date-fns/addDays';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import dateFormat from 'date-fns/format';

import {list, take, range, enumerate} from '@aureooms/js-itertools';

import {ALL_WEEK_DAYS} from './constants.js';

import EventFragment from './EventFragment.js';

const ColumnHeader = ({classes, day, col}) => {
	return (
		<div
			className={classNames(classes.columnHeader, {
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

const dayKey = (datetime) => dateFormat(datetime, 'yyyyMMdd');

function* generateDays(begin, end, displayedWeekDays = new Set(ALL_WEEK_DAYS)) {
	let i = 0;
	let current = begin;
	while (current < end) {
		if (displayedWeekDays.has(Math.trunc(i % 7))) yield current;
		current = addDays(begin, ++i);
	}
}

function* generateDaysProps(
	begin,
	end,
	displayedWeekDays = new Set(ALL_WEEK_DAYS)
) {
	const rowSize = displayedWeekDays.size;
	const days = generateDays(begin, end, displayedWeekDays);
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
		occupancy.set(dayKey(day), 0);
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

		const day = dayKey(event.begin);

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
		const key = dayKey(day);
		const count = occupancy.get(key) - maxLines;
		if (count > 0) {
			yield {
				day: key,
				count
			};
		}
	}
}

const More = (props) => {
	const {className, count} = props;

	return <div className={className}>{count} more</div>;
};

const CalendarDataGrid = (props) => {
	const {
		useStyles,
		rowSize,
		days,
		events,
		mores,
		DayHeader,
		WeekNumber,
		weekOptions,
		onSlotClick
	} = props;

	const classes = useStyles();

	return (
		<Paper>
			<div className={classes.header}>
				{WeekNumber && (
					<div
						className={classNames(classes.corner, {
							[classes.col0]: true,
							[classes.row0]: true
						})}
					/>
				)}
				{list(take(days, rowSize)).map((props, key) => (
					<ColumnHeader key={key} classes={classes} {...props} />
				))}
			</div>
			<div className={classes.grid}>
				{WeekNumber &&
					days
						.filter((_, i) => i % rowSize === rowSize - 1)
						.map((props, key) => (
							<WeekNumber
								key={key}
								className={classNames(classes.weekNumber, {
									[classes.col0]: true,
									[classes[`row${props.row}`]]: true
								})}
								weekOptions={weekOptions}
								{...props}
							/>
						))}
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
						weekOptions={weekOptions}
						{...props}
					/>
				))}
				{events
					.filter((props) => `day${props.day}slot${props.slot}` in classes)
					.map((props, key) => (
						<EventFragment
							key={key}
							className={classNames(classes.slot, {
								[classes[`day${props.day}slot${props.slot}`]]: true
							})}
							eventProps={{className: classes.event}}
							{...props}
						/>
					))}
				{mores
					.filter((props) => `day${props.day}more` in classes)
					.map((props, key) => (
						<More
							key={key}
							className={classNames(classes.more, {
								[classes[`day${props.day}more`]]: true
							})}
							{...props}
						/>
					))}
			</div>
		</Paper>
	);
};

CalendarDataGrid.propTypes = {
	DayHeader: PropTypes.elementType,
	WeekNumber: PropTypes.elementType
};

const CalendarData = (props) => {
	const {
		events,
		begin,
		end,
		lineHeight,
		maxLines,
		DayHeader,
		WeekNumber,
		weekOptions,
		displayedWeekDays,
		onSlotClick,
		onEventClick
	} = props;

	const days = differenceInDays(end, begin); // Should be a multiple of 7
	if (days % 7 !== 0) console.warn(`days (= ${days}) is not a multiple of 7`);

	const _displayedWeekDays = new Set(displayedWeekDays);
	const rowSize = _displayedWeekDays.size;

	const nrows = days / 7;

	const daysProps = [...generateDaysProps(begin, end, _displayedWeekDays)];

	const occupancy = createOccupancyMap(begin, end);
	const eventProps = [
		...generateEventProps(occupancy, begin, end, maxLines - 2, events)
	];
	const moreProps = [...generateMoreProps(occupancy, begin, end, maxLines - 2)];

	const headerHeight = 2;

	const displayWeekNumbers = Boolean(WeekNumber);

	const gridTemplateColumns = [
		displayWeekNumbers && '25px',
		`repeat(${rowSize}, 1fr)`
	]
		.filter((x) => Boolean(x))
		.join(' ');

	const gridStyles = {
		header: {
			display: 'grid',
			gridTemplateColumns,
			gridTemplateRows: `repeat(${headerHeight}, ${lineHeight})`,
			lineHeight: `calc(2*${lineHeight})`,
			backgroundColor: '#aaa',
			gridGap: '1px'
		},
		columnHeader: {
			backgroundColor: '#fff',
			fontWeight: 'bold',
			textAlign: 'center',
			color: '#aaa',
			padding: '5px 5px',
			gridColumnEnd: 'span 1',
			gridRowEnd: `span ${headerHeight}`
		},
		corner: {
			backgroundColor: '#fff',
			gridColumnEnd: 'span 1',
			gridRowEnd: `span ${headerHeight}`
		},
		grid: {
			display: 'grid',
			gridTemplateColumns,
			gridTemplateRows: `repeat(${nrows * maxLines}, ${lineHeight})`,
			backgroundColor: '#aaa',
			gridGap: '1px'
		},
		dayHeader: {
			margin: '3px auto',
			textAlign: 'center',
			gridColumnEnd: 'span 1',
			gridRowEnd: 'span 1'
		},
		weekNumber: {
			backgroundColor: '#fff',
			gridColumnEnd: 'span 1',
			gridRowEnd: `span ${maxLines}`,
			paddingTop: '5px',
			textAlign: 'center'
		},
		dayBox: {
			backgroundColor: '#fff',
			gridColumnEnd: 'span 1',
			gridRowEnd: `span ${maxLines}`,
			'&:hover': {
				backgroundColor: '#f5f5f5'
			}
		},
		slot: {
			gridColumnEnd: 'span 1',
			gridRowEnd: 'span 1',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			margin: '0 10px 3px 10px'
		},
		event: {
			display: 'inline-block',
			width: '100%',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			padding: '1px 6px',
			borderRadius: '3px'
		},
		more: {
			margin: '0 auto 0 15px',
			gridColumnEnd: 'span 1',
			gridRowEnd: 'span 1',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			fontWeight: 'bold'
		}
	};

	const colOffset = displayWeekNumbers ? 1 : 0;

	for (const i of range(1, rowSize + 1)) {
		gridStyles[`col${i}`] = {
			gridColumnStart: colOffset + i
		};
	}

	for (const i of range(1, nrows + 1)) {
		gridStyles[`row${i}`] = {
			gridRowStart: (i - 1) * maxLines + 1
		};
	}

	for (const {day, row, col} of daysProps) {
		const dayId = dayKey(day);
		for (const j of range(1, maxLines)) {
			gridStyles[`day${dayId}slot${j}`] = {
				gridColumnStart: colOffset + col,
				gridRowStart: (row - 1) * maxLines + 1 + j
			};
		}

		gridStyles[`day${dayId}more`] = {
			gridColumnStart: colOffset + col,
			gridRowStart: row * maxLines
		};
	}

	const useStyles = makeStyles(() => gridStyles);

	return (
		<CalendarDataGrid
			useStyles={useStyles}
			rowSize={rowSize}
			days={daysProps}
			events={eventProps}
			mores={moreProps}
			DayHeader={DayHeader}
			WeekNumber={WeekNumber}
			weekOptions={weekOptions}
			onSlotClick={onSlotClick}
			onEventClick={onEventClick}
		/>
	);
};

CalendarData.defaultProps = {
	lineHeight: '25px',
	displayedWeekDays: ALL_WEEK_DAYS
};

CalendarData.propTypes = {
	begin: PropTypes.instanceOf(Date).isRequired,
	end: PropTypes.instanceOf(Date).isRequired,
	events: PropTypes.array.isRequired,
	maxLines: PropTypes.number.isRequired,
	lineHeight: PropTypes.any,
	displayedWeekDays: PropTypes.array,
	onSlotClick: PropTypes.func,
	onEventClick: PropTypes.func
};

export default CalendarData;
