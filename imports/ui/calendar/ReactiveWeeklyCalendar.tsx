import React, {useEffect, useState} from 'react';

import {useNavigate} from 'react-router-dom';

import {type SnackbarOrigin, useSnackbar} from 'notistack';

import {styled} from '@mui/material/styles';

import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import TodayIcon from '@mui/icons-material/Today';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import addWeeks from 'date-fns/addWeeks';
import addDays from 'date-fns/addDays';
import subWeeks from 'date-fns/subWeeks';
import addMilliseconds from 'date-fns/addMilliseconds';
import startOfToday from 'date-fns/startOfToday';
import getDay from 'date-fns/getDay';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import setHours from 'date-fns/setHours';
import startOfWeek from 'date-fns/startOfWeek';
import isThisWeek from 'date-fns/isThisWeek';

import {any} from '@iterable-iterator/reduce';
import {map} from '@iterable-iterator/map';
import {chain, _chain} from '@iterable-iterator/chain';
import {range} from '@iterable-iterator/range';
import {window} from '@iterable-iterator/window';
import {sorted} from '@iterable-iterator/sorted';
import {filter} from '@iterable-iterator/filter';
import {key} from '@total-order/key';
import {increasing} from '@total-order/date';

import {msToString, units, units as durationUnits} from '../../api/duration';

import {
	useDateFormat,
	useFirstWeekContainsDate,
	useWeekStartsOn,
} from '../../i18n/datetime';

import useEvents from '../events/useEvents';

import useAvailability from '../availability/useAvailability';
import {type SlotDocument} from '../../api/collection/availability';
import {generateDays, getDayOfWeekModulo} from '../../util/datetime';
import useSortedWorkSchedule from '../settings/useSortedWorkSchedule';
import {mod} from '../../util/artithmetic';
import type PropsOf from '../../util/PropsOf';
import useTimeSlotToString from '../settings/useTimeSlotToString';
import useIsMounted from '../hooks/useIsMounted';
import next from '../../api/endpoint/availability/next';
import nonOverlappingIntersection from '../../lib/interval/nonOverlappingIntersection';
import {weekSlotsCyclicOrder} from '../settings/useWorkScheduleSort';
import intersection from '../../lib/interval/intersection';
import useStateWithInitOverride from '../hooks/useStateWithInitOverride';
import {useSetting} from '../settings/hooks';
import call from '../../api/endpoint/call';
import type ModuloWeekInterval from '../settings/ModuloWeekInterval';
import ColorChip from '../chips/ColorChip';
import Header from './Header';
import DayHeader from './DayHeader';
import StaticWeeklyCalendar from './StaticWeeklyCalendar';
import {weekly} from './ranges';

const slotOrder = weekSlotsCyclicOrder(0);

const measure = (a: number, b: number): number => b - a;

const prepareAvailability = (
	begin: Date,
	end: Date,
	now: Date,
	workSchedule: ModuloWeekInterval[],
	availability: SlotDocument[],
): IterableIterator<[number, number]> => {
	const weekSlots = window(2, generateDays(begin, addDays(end, 1)));
	const weekStartsOn = getDay(begin);
	const spannedWeeks = Math.ceil(
		differenceInMilliseconds(end, begin) / durationUnits.week,
	);
	const weekAvailability = _chain(
		map(
			(week: number) =>
				map(({beginModuloWeek, endModuloWeek}) => {
					const beginDay = getDayOfWeekModulo(beginModuloWeek);
					const endDay = getDayOfWeekModulo(endModuloWeek);
					const beginMilliseconds = beginModuloWeek % durationUnits.day;
					const endMilliseconds = endModuloWeek % durationUnits.day;
					const beginHours = Math.floor(beginMilliseconds / durationUnits.hour);
					const endHours = Math.floor(endMilliseconds / durationUnits.hour);
					const leftOverBeginMilliseconds =
						beginMilliseconds % durationUnits.hour;
					const leftOverEndMilliseconds = endMilliseconds % durationUnits.hour;
					return [
						addMilliseconds(
							setHours(
								addDays(begin, mod(beginDay - weekStartsOn, 7) + week * 7),
								beginHours,
							),
							leftOverBeginMilliseconds,
						),
						addMilliseconds(
							setHours(
								addDays(begin, mod(endDay - weekStartsOn, 7) + week * 7),
								endHours,
							),
							leftOverEndMilliseconds,
						),
					];
				}, workSchedule),
			range(spannedWeeks),
		),
	);
	const slots = nonOverlappingIntersection(weekSlots, weekAvailability);
	const events = map((x) => [x.begin, x.end], availability);
	return map(
		(event) => (event[0] < now ? [now, event[1]] : event),
		filter(
			(event) => event[1] > now,
			nonOverlappingIntersection(slots, events),
		),
	);
};

const toProps = (
	intervals: IterableIterator<[number, number]>,
	calendar: (begin: Date, end: Date) => string,
	onSlotClick: (slot: Date, noInitialTime?: boolean) => void,
) => {
	return map(
		([begin, end]) => ({
			calendar: calendar(begin, end),
			begin,
			end,
			onClick() {
				onSlotClick(begin, false);
			},
		}),
		intervals,
	);
};

type Props = {
	year: number;
	week: number;
	showCancelledEvents?: boolean;
	showNoShowEvents?: boolean;
} & Omit<
	PropsOf<typeof StaticWeeklyCalendar>,
	'next' | 'prev' | 'monthly' | 'weekOptions' | 'DayHeader' | 'events'
>;

const ListItem = styled('li')(({theme}) => ({
	margin: theme.spacing(0.5),
}));

const anchorOrigin: SnackbarOrigin = {
	horizontal: 'center',
	vertical: 'top',
};

const ReactiveWeeklyCalendar = ({
	year,
	week,
	showCancelledEvents,
	showNoShowEvents,
	onSlotClick,
	...rest
}: Props) => {
	const isMounted = useIsMounted();
	const {enqueueSnackbar} = useSnackbar();
	const [cancel, setCancel] = useState<null | (() => void)>(null);
	const pending = cancel !== null;
	const {loading: loadingAppointmentDuration, value: appointmentDuration} =
		useSetting('appointment-duration');
	const initDuration =
		appointmentDuration.length > 0 ? appointmentDuration[0] : 0;
	const [duration, setDuration] = useStateWithInitOverride<number>(
		initDuration,
		[appointmentDuration],
	);
	const [searching, setSearching] = useState(false);
	const weekStartsOn = useWeekStartsOn();
	const firstWeekContainsDate = useFirstWeekContainsDate();

	const weekOptions = {
		weekStartsOn,
		firstWeekContainsDate,
	};

	const [begin, end] = weekly(year, week, weekOptions);

	const someDayOfWeek = new Date(
		year,
		0,
		weekOptions.firstWeekContainsDate + (week - 1) * 7,
	);
	const isCurrentWeek = isThisWeek(someDayOfWeek, {
		weekStartsOn,
	});
	const someDayOfPrevWeek = subWeeks(someDayOfWeek, 1);
	const someDayOfNextWeek = addWeeks(someDayOfWeek, 1);
	const localizedDateFormat = useDateFormat();
	const prevWeek = localizedDateFormat(someDayOfPrevWeek, 'YYYY/ww', {
		useAdditionalWeekYearTokens: true,
	});
	const nextWeek = localizedDateFormat(someDayOfNextWeek, 'YYYY/ww', {
		useAdditionalWeekYearTokens: true,
	});
	const monthOfWeek = localizedDateFormat(someDayOfWeek, 'yyyy/MM');

	const title = localizedDateFormat(
		someDayOfWeek,
		"yyyy MMMM / 'Week' w",
		weekOptions,
	);

	const {results: events} = useEvents(begin, end, {}, {sort: {begin: 1}}, [
		Number(begin),
		Number(end),
	]);

	const thisMorning = startOfToday();

	const {results: availability} = useAvailability(
		begin,
		end,
		{
			end: {$gt: thisMorning},
			weight: 0,
		},
		{sort: {begin: 1}},
		[Number(thisMorning), Number(begin), Number(end)],
	);

	const workSchedule = useSortedWorkSchedule();

	const now = new Date();

	const timeSlotToString = useTimeSlotToString();
	const [selected, setSelected] = useState<Set<string>>(new Set<string>());

	const displayedWorkSchedule = searching
		? workSchedule.filter((x) => selected.has(timeSlotToString(x)))
		: workSchedule;

	const hiddenWorkSchedule = searching
		? workSchedule.filter((x) => !selected.has(timeSlotToString(x)))
		: [];

	const displayedAvailability = prepareAvailability(
		begin,
		end,
		now,
		displayedWorkSchedule,
		availability,
	);

	const hiddenAvailability = prepareAvailability(
		begin,
		end,
		now,
		hiddenWorkSchedule,
		availability,
	);

	// NOTE Adding + duration to the default whole span makes it intersect all
	// slots with measure >= duration, including those that span two calendar
	// weeks. Another approach would be to handle the case where no constraints
	// are given to next.
	const weekConstraint: Array<[number, number]> = [[0, units.week + duration]];

	const constraints = Array.from(
		nonOverlappingIntersection(
			weekConstraint,
			map(
				({beginModuloWeek, endModuloWeek}) => [beginModuloWeek, endModuloWeek],
				sorted(slotOrder, displayedWorkSchedule),
			),
		),
	);

	const navigate = useNavigate();

	const displayedEvents = sorted(
		key(increasing, (x) => x.begin),
		chain(
			filter(
				(x) =>
					(showCancelledEvents || !x.isCancelled) &&
					(showNoShowEvents || !x.isNoShow),
				events,
			),
			toProps(
				displayedAvailability,
				searching
					? (begin, end) =>
							end.getTime() - begin.getTime() >= duration
								? 'availability'
								: 'availability-hidden'
					: (_begin, _end) => 'availability',
				onSlotClick,
			),
			toProps(hiddenAvailability, () => 'availability-hidden', onSlotClick),
		),
	);

	useEffect(() => {
		// NOTE If any of the query parameters changes (through user input) we
		// cancel any pending query. Note that now does not need to be taken
		// into account as it is not input by the user.
		cancel?.();
	}, [searching, JSON.stringify(end), duration, JSON.stringify(constraints)]);

	const after = end < now ? now : end;

	return (
		<>
			<Collapse in={searching}>
				<div>
					<Header
						title="Search"
						actions={[
							// eslint-disable-next-line react/jsx-key
							<Button
								disabled={isCurrentWeek}
								endIcon={<TodayIcon />}
								onClick={() => {
									const currentWeek = localizedDateFormat(
										new Date(),
										'YYYY/ww',
										{
											useAdditionalWeekYearTokens: true,
										},
									);
									navigate(`../${currentWeek}`);
								}}
							>
								Back to current week
							</Button>,
							// eslint-disable-next-line react/jsx-key
							<LoadingButton
								variant="contained"
								color="primary"
								loading={pending}
								disabled={selected.size === 0}
								loadingPosition="end"
								endIcon={<NextPlanIcon />}
								onClick={() => {
									cancel?.();
									let cancelled = false;
									setCancel(() => () => {
										cancelled = true;
										setCancel(null);
									});
									call(next, after, duration, constraints).then(
										(result) => {
											if (!isMounted() || cancelled) return;
											setCancel(null);
											if (result === null) {
												enqueueSnackbar('No availability', {
													variant: 'warning',
													anchorOrigin,
												});
												return;
											}

											const jumpTo =
												result.begin < end
													? end
													: any(
															// NOTE Here we distinguish
															// between first week hits
															// and second week hits.
															map(([left, right]) => {
																const [i0, i1] = intersection(
																	left,
																	right,
																	result.weekShiftedBegin,
																	result.weekShiftedEnd,
																);
																return measure(i0, i1) >= duration;
															}, constraints),
													  )
													? startOfWeek(result.begin, {weekStartsOn})
													: addWeeks(
															startOfWeek(result.begin, {weekStartsOn}),
															1,
													  );
											const jumpToWeek = localizedDateFormat(
												jumpTo,
												'YYYY/ww',
												{
													useAdditionalWeekYearTokens: true,
												},
											);
											navigate(`../${jumpToWeek}`);
										},
										(error: unknown) => {
											if (!isMounted() || cancelled) return;
											setCancel(null);
											console.debug(error);
											const message =
												error instanceof Error
													? error.message
													: 'unknown error';
											enqueueSnackbar(`Error: ${message}`, {
												variant: 'error',
												anchorOrigin,
											});
										},
									);
								}}
							>
								Next Available
							</LoadingButton>,
							// eslint-disable-next-line react/jsx-key
							<Button
								color="primary"
								disabled={selected.size === workSchedule.length}
								endIcon={<CheckCircleOutlineIcon />}
								onClick={() => {
									setSelected(
										new Set<string>(workSchedule.map(timeSlotToString)),
									);
								}}
							>
								Select all
							</Button>,
							// eslint-disable-next-line react/jsx-key
							<Button
								color="primary"
								disabled={selected.size === 0}
								endIcon={<HighlightOffIcon />}
								onClick={() => {
									setSelected(new Set<string>());
								}}
							>
								Clear Selection
							</Button>,
							// eslint-disable-next-line react/jsx-key
							<Button
								color="secondary"
								endIcon={<SearchOffIcon />}
								onClick={() => {
									setSelected(new Set<string>());
									setDuration(initDuration);
									setSearching(false);
								}}
							>
								Close
							</Button>,
						]}
					/>
					<Grid container alignItems="center">
						<Grid item xs={9} md={10} lg={11}>
							<ul
								style={{
									display: 'flex',
									justifyContent: 'center',
									flexWrap: 'wrap',
									listStyle: 'none',
								}}
							>
								{workSchedule.map((timeSlot) => {
									const label = timeSlotToString(timeSlot);
									const isSelected = selected.has(label);
									return (
										<ListItem key={label}>
											<ColorChip
												label={label}
												color={isSelected ? '#a5f8ad' : undefined}
												icon={
													isSelected ? (
														<CheckCircleOutlineIcon />
													) : (
														<RadioButtonUncheckedIcon />
													)
												}
												onClick={
													isSelected
														? () => {
																const newSelected = new Set(selected);
																newSelected.delete(label);
																setSelected(newSelected);
														  }
														: () => {
																const newSelected = new Set(selected);
																newSelected.add(label);
																setSelected(newSelected);
														  }
												}
											/>
										</ListItem>
									);
								})}
							</ul>
						</Grid>
						<Grid item xs={3} md={2} lg={1}>
							<FormControl fullWidth>
								<InputLabel htmlFor="duration">Duration</InputLabel>
								<Select
									fullWidth
									readOnly={loadingAppointmentDuration}
									value={duration}
									onChange={(e) => {
										setDuration(e.target.value as number);
									}}
								>
									{appointmentDuration.map((x) => (
										<MenuItem key={x} value={x}>
											{msToString(x)}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
				</div>
			</Collapse>
			<StaticWeeklyCalendar
				title={title}
				year={year}
				week={week}
				navigationRole="link"
				prev={() => {
					navigate(`../${prevWeek}`);
				}}
				next={() => {
					navigate(`../${nextWeek}`);
				}}
				monthly={() => {
					navigate(`../../month/${monthOfWeek}`);
				}}
				actions={[
					// eslint-disable-next-line react/jsx-key
					<Button
						disabled={searching}
						color="primary"
						endIcon={<SearchIcon />}
						onClick={() => {
							setSearching(true);
						}}
					>
						Search
					</Button>,
				]}
				events={displayedEvents}
				DayHeader={DayHeader}
				weekOptions={weekOptions}
				onSlotClick={onSlotClick}
				{...rest}
			/>
		</>
	);
};

export default ReactiveWeeklyCalendar;
