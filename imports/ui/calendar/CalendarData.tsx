import React from 'react';
import PropTypes, {InferProps} from 'prop-types';
import classNames from 'classnames';

import {makeStyles, createStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import differenceInDays from 'date-fns/differenceInDays';
import addDays from 'date-fns/addDays';
import getDay from 'date-fns/getDay';
import getMonth from 'date-fns/getMonth';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import dateParse from 'date-fns/parse';
import dateFormat from 'date-fns/format';

import {list} from '@iterable-iterator/list';
import {take} from '@iterable-iterator/slice';
import {range} from '@iterable-iterator/range';
import {enumerate} from '@iterable-iterator/zip';
import {useDateFormat} from '../../i18n/datetime';

import {ALL_WEEK_DAYS} from './constants';

import EventFragment from './EventFragment';

const ColumnHeader = ({classes, day, col}) => {
	const getDayName = useDateFormat('cccc');
	return (
		<div
			className={classNames(classes.columnHeader, {
				[classes[`col${col}`]]: true,
			})}
		>
			{getDayName(day)}
		</div>
	);
};

const DayBox = ({classes, day, row, col, onSlotClick}) => (
	<div
		className={classNames(classes.dayBox, {
			[classes[`col${col}`]]: true,
			[classes[`row${row}`]]: true,
		})}
		onClick={() => {
			onSlotClick?.(day);
		}}
	/>
);

const setTime = (datetime: Date, HHmm: string) =>
	dateParse(HHmm, 'HH:mm', datetime);

/**
 * Compute day key.
 */
const dayKey = (datetime: Date) => dateFormat(datetime, 'yyyyMMdd');

/**
 * Generate days in range.
 */
function* generateDays(
	begin: Date,
	end: Date,
	displayedWeekDays: Set<number> = new Set(ALL_WEEK_DAYS),
): IterableIterator<Date> {
	let current = begin;
	while (current < end) {
		if (displayedWeekDays.has(getDay(current))) yield current;
		current = addDays(current, 1);
	}
}

interface DayProps {
	day: Date;
	row: number;
	col: number;
	isFirstDisplayedDayOfMonth: boolean;
}

/**
 * Generate props for each day in range.
 */
function* generateDaysProps(
	begin: Date,
	end: Date,
	displayedWeekDays: Set<number> = new Set(ALL_WEEK_DAYS),
): IterableIterator<DayProps> {
	const rowSize = displayedWeekDays.size;
	const days = generateDays(begin, end, displayedWeekDays);
	let currentMonth = -1;
	for (const [ith, day] of enumerate(days)) {
		const col = (ith % rowSize) + 1;
		const row = (ith - col + 1) / rowSize + 1;
		const monthOfDay = getMonth(day);
		let isFirstDisplayedDayOfMonth = false;
		if (monthOfDay !== currentMonth) {
			currentMonth = monthOfDay;
			isFirstDisplayedDayOfMonth = true;
		}

		yield {
			day,
			row,
			col,
			isFirstDisplayedDayOfMonth,
		};
	}
}

interface Occupancy {
	usedSlots: number;
	totalEvents: number;
	shownEvents: number;
}

type OccupancyMap = Map<string, Occupancy>;

function createOccupancyMap(begin: Date, end: Date): OccupancyMap {
	const occupancy = new Map();

	for (const day of generateDays(begin, end)) {
		occupancy.set(dayKey(day), {usedSlots: 0, totalEvents: 0, shownEvents: 0});
	}

	return occupancy;
}

interface Event {
	begin: Date;
	end: Date;
}

/**
 * Assumes the input events are sorted by begin datetime.
 */
function* generateEventProps(
	occupancy: OccupancyMap,
	begin: Date,
	end: Date,
	options: any,
	events: Iterable<Event>,
): IterableIterator<{event: Event; day: string; slot: number; slots: number}> {
	const {maxLines, skipIdle, minEventDuration, dayBegins} = options;

	let previousEvent: {end: Date};
	let previousDay: string;
	for (const event of events) {
		if (
			(event.end && isBefore(event.end, begin)) ||
			isAfter(event.begin, end)
		) {
			continue;
		}

		const day = dayKey(event.begin);

		if (day !== previousDay) {
			previousEvent = dayBegins
				? {
						end: setTime(event.begin, dayBegins),
				  }
				: undefined;
		}

		const duration =
			Number(event.end) - Number(event.begin) || minEventDuration;

		const slots = minEventDuration ? Math.ceil(duration / minEventDuration) : 1;

		const skip =
			skipIdle && previousEvent
				? minEventDuration
					? Math.min(
							3,
							Math.max(
								0,
								Math.floor(
									(Number(event.begin) - Number(previousEvent.end)) /
										minEventDuration,
								),
							),
					  )
					: 1
				: 0;

		let {usedSlots, totalEvents, shownEvents} = occupancy.get(day);
		const slot = usedSlots + skip + 1;
		++totalEvents;
		usedSlots += skip + slots;

		if (usedSlots <= maxLines) {
			++shownEvents;
			yield {
				event,
				day,
				slot,
				slots,
			};
		}

		occupancy.set(day, {
			usedSlots,
			totalEvents,
			shownEvents,
		});
		previousEvent = event;
		previousDay = day;
	}
}

/**
 * generateMoreProps.
 *
 * @param {Map<string, {totalEvents: number, shownEvents: number}>} occupancy
 * @param {Date} begin
 * @param {Date} end
 * @return {IterableIterator<{day: string, count: number}>}
 */
function* generateMoreProps(occupancy, begin: Date, end: Date) {
	for (const day of generateDays(begin, end)) {
		const key = dayKey(day);
		const {totalEvents, shownEvents} = occupancy.get(key);
		const count = totalEvents - shownEvents;
		if (count > 0) {
			yield {
				day: key,
				count,
			};
		}
	}
}

const More = ({className, count}) => (
	<div className={className}>{count} more</div>
);

const CalendarDataGridPropTypes = {
	DayHeader: PropTypes.elementType,
	WeekNumber: PropTypes.elementType,
	useStyles: PropTypes.func.isRequired,
	rowSize: PropTypes.number.isRequired,
	days: PropTypes.array.isRequired,
	events: PropTypes.array.isRequired,
	mores: PropTypes.array.isRequired,
	weekOptions: PropTypes.object.isRequired,
	onSlotClick: PropTypes.func,
	onEventClick: PropTypes.func,
};

type CalendarDataGridProps = InferProps<typeof CalendarDataGridPropTypes>;

const CalendarDataGrid = ({
	useStyles,
	rowSize,
	days,
	events,
	mores,
	DayHeader,
	WeekNumber,
	weekOptions,
	onSlotClick,
}: CalendarDataGridProps) => {
	const classes = useStyles();

	return (
		<Paper>
			<div className={classes.header}>
				{WeekNumber && (
					<div
						className={classNames(classes.corner, {
							[classes.col0]: true,
							[classes.row0]: true,
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
									[classes[`row${props.row}`]]: true,
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
							[classes[`row${props.row}`]]: true,
						})}
						{...props}
					/>
				))}
				{events
					.filter((props) => `day${props.day}slot${props.slot}` in classes)
					.map((props, key) => (
						<EventFragment
							key={key}
							className={classNames(classes.slot, {
								[classes[`slot${props.slots}`]]: true,
								[classes[`day${props.day}slot${props.slot}`]]: true,
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
								[classes[`day${props.day}more`]]: true,
							})}
							{...props}
						/>
					))}
			</div>
		</Paper>
	);
};

CalendarDataGrid.propTypes = CalendarDataGridPropTypes;

const CalendarDataPropTypes = {
	begin: PropTypes.instanceOf(Date).isRequired,
	end: PropTypes.instanceOf(Date).isRequired,
	events: PropTypes.array.isRequired,
	skipIdle: PropTypes.bool,
	maxLines: PropTypes.number.isRequired,
	minEventDuration: PropTypes.number,
	dayBegins: PropTypes.string,
	weekOptions: PropTypes.object,
	DayHeader: PropTypes.elementType,
	WeekNumber: PropTypes.elementType,
	lineHeight: PropTypes.any,
	displayedWeekDays: PropTypes.array,
	onSlotClick: PropTypes.func,
	onEventClick: PropTypes.func,
};

type CalendarDataProps = InferProps<typeof CalendarDataPropTypes>;

const CalendarData = ({
	events,
	begin,
	end,
	lineHeight = '25px',
	maxLines,
	skipIdle = false,
	minEventDuration,
	dayBegins,
	DayHeader,
	WeekNumber,
	weekOptions,
	displayedWeekDays = ALL_WEEK_DAYS,
	onSlotClick,
	onEventClick,
}: CalendarDataProps) => {
	const days = differenceInDays(end, begin); // Should be a multiple of 7
	if (days % 7 !== 0) console.warn(`days (= ${days}) is not a multiple of 7`);

	const _displayedWeekDays = new Set(displayedWeekDays);
	const rowSize = _displayedWeekDays.size;

	const nrows = days / 7;

	const daysProps = [...generateDaysProps(begin, end, _displayedWeekDays)];

	const occupancy = createOccupancyMap(begin, end);
	const eventPropsOptions = {
		maxLines: maxLines - 2,
		skipIdle,
		minEventDuration,
		dayBegins,
	};
	const eventProps = [
		...generateEventProps(occupancy, begin, end, eventPropsOptions, events),
	];
	const moreProps = [...generateMoreProps(occupancy, begin, end)];

	const headerHeight = 2;

	const displayWeekNumbers = Boolean(WeekNumber);

	const gridTemplateColumns = [
		displayWeekNumbers && '25px',
		`repeat(${rowSize}, 1fr)`,
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
			gridGap: '1px',
		},
		columnHeader: {
			backgroundColor: '#fff',
			fontWeight: 'bold',
			textAlign: 'center',
			color: '#aaa',
			padding: '5px 5px',
			gridColumnEnd: 'span 1',
			gridRowEnd: `span ${headerHeight}`,
		},
		corner: {
			backgroundColor: '#fff',
			gridColumnEnd: 'span 1',
			gridRowEnd: `span ${headerHeight}`,
		},
		grid: {
			display: 'grid',
			gridTemplateColumns,
			gridTemplateRows: `repeat(${nrows * maxLines}, ${lineHeight})`,
			backgroundColor: '#aaa',
			gridGap: '1px',
		},
		dayHeader: {
			margin: '3px auto',
			textAlign: 'center',
			gridColumnEnd: 'span 1',
			gridRowEnd: 'span 1',
		},
		weekNumber: {
			backgroundColor: '#fff',
			gridColumnEnd: 'span 1',
			gridRowEnd: `span ${maxLines}`,
			paddingTop: '5px',
			textAlign: 'center',
		},
		dayBox: {
			backgroundColor: '#fff',
			gridColumnEnd: 'span 1',
			gridRowEnd: `span ${maxLines}`,
			'&:hover': {
				backgroundColor: '#f5f5f5',
			},
		},
		slot: {
			gridColumnEnd: 'span 1',
			margin: '0 10px 3px 10px',
		},
		slot1: {
			gridRowEnd: 'span 1',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
		},
		event: {
			display: 'inline-block',
			width: '100%',
			height: '100%',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			padding: '1px 6px',
			borderRadius: '3px',
		},
		more: {
			margin: '0 auto 0 15px',
			gridColumnEnd: 'span 1',
			gridRowEnd: 'span 1',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			fontWeight: 'bold',
		},
	};

	const colOffset = displayWeekNumbers ? 1 : 0;

	for (const i of range(1, rowSize + 1)) {
		gridStyles[`col${i}`] = {
			gridColumnStart: colOffset + (i as number),
		};
	}

	for (const i of range(1, nrows + 1)) {
		gridStyles[`row${i}`] = {
			gridRowStart: (i - 1) * maxLines + 1,
		};
	}

	for (const {day, row, col} of daysProps) {
		const dayId = dayKey(day);
		for (const j of range(1, maxLines)) {
			gridStyles[`day${dayId}slot${j}`] = {
				gridColumnStart: colOffset + col,
				gridRowStart: (row - 1) * maxLines + 1 + (j as number),
			};
		}

		gridStyles[`day${dayId}more`] = {
			gridColumnStart: colOffset + col,
			gridRowStart: row * maxLines,
		};
	}

	const slotTypes = new Set(
		eventProps.map(({slots}) => slots).filter((x) => x !== 1),
	);
	for (const slots of slotTypes) {
		gridStyles[`slot${slots}`] = {
			gridRowEnd: `span ${slots}`,
			textOverflow: 'ellipsis',
			whiteSpace: 'pre-wrap',
			overflow: 'hidden',
		};
	}

	const styles = createStyles(() => gridStyles);
	const useStyles = makeStyles(styles);

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

CalendarData.propTypes = CalendarDataPropTypes;

export default CalendarData;
