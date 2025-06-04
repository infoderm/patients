import React, {useMemo, useState, useLayoutEffect} from 'react';

import Paper from '@mui/material/Paper';
import {grey} from '@mui/material/colors';

import differenceInDays from 'date-fns/differenceInDays';
import getMonth from 'date-fns/getMonth';
import isEqual from 'date-fns/isEqual';
import minDate from 'date-fns/min';
import maxDate from 'date-fns/max';
import dateParse from 'date-fns/parse';
import dateFormat from 'date-fns/format';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';

import {key} from '@total-order/key';
import {increasing} from '@total-order/primitive';
import {iterable} from '@total-order/iter';

import {list} from '@iterable-iterator/list';
import {take} from '@iterable-iterator/slice';
import {range} from '@iterable-iterator/range';
import {min} from '@iterable-iterator/reduce';
import {enumerate} from '@iterable-iterator/zip';
import {useTheme} from '@mui/material/styles';

import makeStyles from '../styles/makeStyles';
import {useDateFormat} from '../../i18n/datetime';

import {ALL_WEEK_DAYS, generateDays, type WeekDay} from '../../util/datetime';
import type CSSObject from '../styles/CSSObject';
import color, {hoverColor} from '../../util/color';

import type Event from './Event';
import EventFragment from './EventFragment';

const DayName = ({day}: {readonly day: Date}) => {
	const getDayName = useDateFormat('cccc');
	return <>{getDayName(day)}</>;
};

type ColumnHeaderProps = {
	readonly classes: Record<string, any>;
	readonly cx: any;
	readonly col: number;
	readonly children: React.ReactNode;
};

const ColumnHeader = ({classes, cx, col, children}: ColumnHeaderProps) => {
	return (
		<div
			className={cx(classes.columnHeader, {
				[classes[`col${col}`]]: true,
			})}
		>
			{children}
		</div>
	);
};

const DayBox = ({classes, cx, day, row, col, onSlotClick}) => {
	const ariaLabel = `Schedule an appointment on ${dateFormat(day, 'PPPP')}`;
	const role = onSlotClick ? 'button' : undefined;
	const onClick = useMemo(() => {
		return onSlotClick
			? () => {
					onSlotClick(day, addDays(day, 1));
			  }
			: undefined;
	}, [onSlotClick, day]);
	return (
		<div
			className={cx(classes.dayBox, {
				[classes[`col${col}`]]: true,
				[classes[`row${row}`]]: true,
			})}
			aria-label={ariaLabel}
			role={role}
			onClick={onClick}
		/>
	);
};

const setTime = (datetime: Date, HHmm: string) =>
	dateParse(HHmm, 'HH:mm', datetime);

/**
 * Compute day key.
 */
const dayKey = (datetime: Date) => dateFormat(datetime, 'yyyyMMdd');

type DayProps = {
	day: Date;
	row: number;
	col: number;
	isFirstDisplayedDayOfMonth: boolean;
};

/**
 * Generate props for each day in range.
 */
function* generateDaysProps(
	begin: Date,
	end: Date,
	displayedWeekDays = new Set<number>(ALL_WEEK_DAYS),
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

type Occupancy = {
	usedSlots: number;
	totalEvents: number;
	shownEvents: number;
};

type OccupancyMap = Map<string, Occupancy>;

function createOccupancyMap(begin: Date, end: Date): OccupancyMap {
	const occupancy = new Map();

	for (const day of generateDays(begin, end)) {
		occupancy.set(dayKey(day), {usedSlots: 0, totalEvents: 0, shownEvents: 0});
	}

	return occupancy;
}

type EventProps = {
	event: Event;
	day: string;
	slot: number;
	slots: number;
};

type GenerateEventPropsOptions = {
	maxLines: number;
	skipIdle: boolean;
	minEventDuration?: number;
	dayBegins?: string;
	displayedWeekDays: Set<number>;
};

/**
 * Assumes the input events are sorted by begin datetime.
 */
function* generateEventProps(
	occupancy: OccupancyMap,
	begin: Date,
	end: Date,
	{
		maxLines,
		skipIdle,
		minEventDuration,
		dayBegins,
		displayedWeekDays,
	}: GenerateEventPropsOptions,
	events: Iterable<Event>,
): IterableIterator<EventProps> {
	for (const event of events) {
		for (const _day of generateDays(
			startOfDay(maxDate([event.begin, begin])),
			minDate([event.end, end]),
			displayedWeekDays,
		)) {
			const day = dayKey(_day);
			const state = occupancy.get(day);

			if (state === undefined) continue;
			let {usedSlots, totalEvents, shownEvents} = state;
			const dayBegin = _day;
			const dayEnd = endOfDay(_day);

			const fragmentBegin = maxDate([event.begin, dayBegin, begin]);
			const fragmentEnd = minDate([event.end, dayEnd, end]);
			const fragmentDuration = Number(fragmentEnd) - Number(fragmentBegin);

			const isWholeDay =
				isEqual(fragmentBegin, dayBegin) && isEqual(fragmentEnd, dayEnd);

			const startOfSchedule =
				dayBegins === undefined ? dayBegin : setTime(_day, dayBegins);

			const slots = Math.min(
				minEventDuration === undefined
					? 1
					: isWholeDay
					? 2
					: Math.max(
							Math.round(
								(fragmentDuration || minEventDuration) / minEventDuration,
							),
							1,
					  ),
				maxLines,
			);

			const slot =
				1 +
				(skipIdle && minEventDuration
					? Math.max(
							usedSlots,
							Math.round(
								(Number(fragmentBegin) - Number(startOfSchedule)) /
									minEventDuration,
							),
					  )
					: usedSlots);

			++totalEvents;
			usedSlots = slot + slots - 1;

			if (usedSlots <= maxLines) {
				++shownEvents;
				yield {
					event: {
						...event,
						begin: fragmentBegin,
						end: fragmentEnd,
					},
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
		}
	}
}

type MoreProps = {
	day: string;
	count: number;
};

function* generateMoreProps(
	occupancy: Map<string, {totalEvents: number; shownEvents: number}>,
	begin: Date,
	end: Date,
): IterableIterator<MoreProps> {
	for (const day of generateDays(begin, end)) {
		const key = dayKey(day);
		const {totalEvents, shownEvents} = occupancy.get(key)!;
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

type CalendarDataGridStyles = Record<string, CSSObject>;

type CalendarDataGridClasses = {
	[key in keyof CalendarDataGridStyles]: string;
};

type CalendarDataGridProps = {
	readonly DayHeader: React.ElementType;
	readonly WeekNumber?: React.ElementType;
	readonly classes: CalendarDataGridClasses;
	readonly cx: any;
	readonly rowSize: number;
	readonly scrollAnchor?: EventProps;
	readonly days: DayProps[];
	readonly events: EventProps[];
	readonly mores: MoreProps[];
	readonly weekOptions?: {};
	readonly onSlotClick?: () => void;
	readonly onEventClick?: () => void;
};

const CalendarDataGrid = ({
	classes,
	cx,
	rowSize,
	scrollAnchor,
	days,
	events,
	mores,
	DayHeader,
	WeekNumber,
	weekOptions,
	onSlotClick,
}: CalendarDataGridProps) => {
	const theme = useTheme();
	const [main, setMain] = useState<HTMLElement | null>(null);
	const [anchor, setAnchor] = useState<HTMLElement | null>(null);

	const eventsCount = events.length;
	const singleRow = days.length <= rowSize;
	useLayoutEffect(() => {
		if (main?.scrollTop !== 0 || eventsCount === 0 || !singleRow) return;
		// TODO: Handle scroll to first search result.
		anchor?.scrollIntoView();
	}, [main, anchor, singleRow, eventsCount]);

	return (
		<Paper className={classes.root}>
			<div className={classes.header}>
				{WeekNumber && <div className={classes.corner} />}
				{list(take(days, rowSize)).map((props, key) => (
					<ColumnHeader key={key} classes={classes} cx={cx} {...props}>
						<DayName day={props.day} />
						{singleRow && <DayHeader {...props} />}
					</ColumnHeader>
				))}
			</div>
			<div ref={setMain} className={classes.main}>
				<div className={classes.grid}>
					{WeekNumber &&
						days
							.filter((_, i) => i % rowSize === rowSize - 1)
							.map((props, key) => (
								<WeekNumber
									key={key}
									className={cx(classes.weekNumber, {
										[classes[`row${props.row}`]!]: true,
									})}
									weekOptions={weekOptions}
									{...props}
								/>
							))}
					{days.map((props, key) => (
						<DayBox
							key={key}
							classes={classes}
							cx={cx}
							{...props}
							onSlotClick={onSlotClick}
						/>
					))}
					{!singleRow &&
						days.map((props, key) => (
							<DayHeader
								key={key}
								className={cx(classes.dayHeader, {
									[classes[`col${props.col}`]!]: true,
									[classes[`row${props.row}`]!]: true,
								})}
								{...props}
							/>
						))}
					{events
						.filter((props) => `day${props.day}slot${props.slot}` in classes)
						.map((props, key) => (
							<EventFragment
								key={key}
								ref={props === scrollAnchor ? setAnchor : undefined}
								theme={theme}
								className={cx(classes.slot, {
									[classes[`slot${props.slots}`]!]: true,
									[classes[`day${props.day}slot${props.slot}`]!]: true,
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
								className={cx(classes.more, {
									[classes[`day${props.day}more`]!]: true,
								})}
								{...props}
							/>
						))}
				</div>
			</div>
		</Paper>
	);
};

type CalendarDataProps = {
	readonly begin: Date;
	readonly end: Date;
	readonly events: Event[];
	readonly skipIdle?: boolean;
	readonly maxLines: number;
	readonly maxHeight?: number | string;
	readonly minEventDuration?: number;
	readonly dayBegins?: string;
	readonly weekOptions?: {};
	readonly DayHeader: React.ElementType;
	readonly WeekNumber?: React.ElementType;
	readonly lineHeight?: string;
	readonly displayedWeekDays?: readonly WeekDay[];
	readonly onSlotClick?: () => void;
	readonly onEventClick?: () => void;
};

type MakeGridStylesOptions = {
	displayWeekNumbers: boolean;
	nrows: number;
	headerHeight: number;
	lineHeight: string;
	rowSize: number;
	maxLines: number;
	maxHeight?: number | string;
	eventProps: EventProps[];
	daysProps: DayProps[];
};

const useGridStyles = makeStyles<MakeGridStylesOptions>()(
	(
		theme,
		{
			displayWeekNumbers,
			nrows,
			headerHeight,
			lineHeight,
			rowSize,
			maxLines,
			maxHeight,
			eventProps,
			daysProps,
		}: MakeGridStylesOptions,
	) => {
		const gridTemplateColumns = [
			displayWeekNumbers && '25px',
			`repeat(${rowSize}, 1fr)`,
		]
			.filter(Boolean)
			.join(' ');

		const gridStyles: CalendarDataGridStyles = {
			root: {
				display: 'flex',
				flexFlow: 'column',
				maxHeight,
			},
			main: {
				overflowY: 'scroll',
			},
			header: {
				display: 'grid',
				gridTemplateColumns,
				gridTemplateRows: `repeat(${headerHeight}, ${lineHeight})`,
				lineHeight: `calc(${nrows === 1 ? 1 : 2}*${lineHeight})`,
				backgroundColor: grey[500],
				gridGap: '1px',
			},
			columnHeader: {
				backgroundColor: theme.palette.background.paper,
				fontWeight: 'bold',
				textAlign: 'center',
				color: grey[500],
				padding: '5px 5px',
				gridColumnEnd: 'span 1',
				gridRowEnd: `span ${headerHeight}`,
			},
			corner: {
				backgroundColor: theme.palette.background.paper,
				gridColumnEnd: 'span 1',
				gridRowEnd: `span ${headerHeight}`,
			},
			grid: {
				display: 'grid',
				gridTemplateColumns,
				gridTemplateRows: `repeat(${nrows * maxLines}, ${lineHeight})`,
				backgroundColor: grey[500],
				gridGap: '1px',
			},
			dayHeader: {
				margin: '3px auto',
				textAlign: 'center',
				gridColumnEnd: 'span 1',
				gridRowEnd: 'span 1',
				'& > a': {
					fontWeight: 'bold',
					color: theme.palette.primary.main,
					'&:hover': {
						textDecoration: 'underline',
					},
				},
			},
			weekNumber: {
				backgroundColor: theme.palette.background.paper,
				gridColumnEnd: 'span 1',
				gridRowEnd: `span ${maxLines}`,
				paddingTop: '5px',
				textAlign: 'center',
				'& > a': {
					fontWeight: 'bold',
					color: theme.palette.primary.main,
					'&:hover': {
						textDecoration: 'underline',
					},
				},
			},
			dayBox: {
				backgroundColor: theme.palette.background.paper,
				gridColumnEnd: 'span 1',
				gridRowEnd: `span ${maxLines}`,
				'&:hover': {
					backgroundColor: hoverColor(
						theme,
						color(theme.palette.background.paper),
					).toRgbString(),
				},
			},
			slot: {
				gridColumnEnd: 'span 1',
				margin: '0 10px 3px 10px',
				'&:hover': {
					opacity: 0.8,
				},
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
					gridRowStart:
						(row - 1) * maxLines + (nrows === 1 ? 0 : 1) + (j as number),
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

		return gridStyles;
	},
);

const CalendarData = ({
	events,
	begin,
	end,
	lineHeight = '25px',
	maxLines,
	maxHeight,
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

	const daysProps = Array.from(
		generateDaysProps(begin, end, _displayedWeekDays),
	);

	const occupancy = createOccupancyMap(begin, end);
	const eventPropsOptions = {
		maxLines: maxLines - 2,
		skipIdle,
		minEventDuration,
		dayBegins,
		displayedWeekDays: _displayedWeekDays,
	};
	const eventProps = Array.from(
		generateEventProps(occupancy, begin, end, eventPropsOptions, events),
	);
	const moreProps = Array.from(generateMoreProps(occupancy, begin, end));

	const {classes, cx} = useGridStyles({
		displayWeekNumbers: Boolean(WeekNumber),
		nrows: days / 7,
		lineHeight,
		headerHeight: 2,
		rowSize,
		maxLines,
		maxHeight,
		eventProps,
		daysProps,
	});

	const eventsCount = eventProps.length;
	const scrollAnchor = useMemo(() => {
		const now = new Date();
		const endOfToday = endOfDay(now);
		return min(
			key(
				iterable(increasing),
				function* ({event: {begin, end}, slot}: EventProps) {
					yield end >= now && begin <= endOfToday ? 0 : 1;
					yield slot;
				},
			),
			eventProps,
		);
	}, [eventsCount, daysProps[0]!.day.getTime()]);

	return (
		<CalendarDataGrid
			classes={classes}
			cx={cx}
			rowSize={rowSize}
			scrollAnchor={scrollAnchor}
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

export default CalendarData;
