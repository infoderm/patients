import React, {useMemo, useState} from 'react';

import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import addMilliseconds from 'date-fns/addMilliseconds';
import subDays from 'date-fns/subDays';
import isBefore from 'date-fns/isBefore';
import startOfToday from 'date-fns/startOfToday';
import getDay from 'date-fns/getDay';

import {map} from '@iterable-iterator/map';
import {filter} from '@iterable-iterator/filter';
import {enumerate} from '@iterable-iterator/zip';
import {window} from '@iterable-iterator/window';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';

import {intersectsInterval} from '../../api/events';

import Prev from '../navigation/Prev';
import Next from '../navigation/Next';
import FixedFab from '../button/FixedFab';

import ReactivePatientChip from '../patients/ReactivePatientChip';

import {useDateFormat} from '../../i18n/datetime';

import useSortedWorkSchedule from '../settings/useSortedWorkSchedule';
import intersection from '../../util/interval/intersection';
import {DAY_MODULO} from '../../util/datetime';
import isEmpty from '../../util/interval/isEmpty';

import NoContent from '../navigation/NoContent';

import ConsultationsList from './ConsultationsList';
import useConsultationsAndAppointments from './useConsultationsAndAppointments';

type Props = {
	readonly day: Date;
};

const ConsultationsOfTheDay = ({day}: Props) => {
	const [showConsultations, setShowConsultations] = useState(true);
	const [showAppointments, setShowAppointments] = useState(true);
	const [showCancelledAppointments, setShowCancelledAppointments] =
		useState(false);
	const [showNoShowAppointments, setShowNoShowAppointments] = useState(false);

	const localizedDateFormat = useDateFormat();

	const {nextDay, dayBefore, dayAfter} = useMemo(() => {
		const prevDay = subDays(day, 1);
		const nextDay = addDays(day, 1);
		const dayBefore = format(prevDay, 'yyyy-MM-dd');
		const dayAfter = format(nextDay, 'yyyy-MM-dd');
		return {
			nextDay,
			dayBefore,
			dayAfter,
		};
	}, [day]);

	const query = {
		filter: intersectsInterval(day, nextDay),
		sort: {datetime: 1} as const,
	};
	const deps = [Number(day)];
	const {loading, results: consultations} = useConsultationsAndAppointments(
		query,
		deps,
	);

	const dayModuloWeek = getDay(day) * DAY_MODULO;
	const nextDayModuloWeek = getDay(nextDay) * DAY_MODULO;
	const workSchedule = useSortedWorkSchedule();
	const intersectingWorkSchedule = filter(
		([left, right]) => !isEmpty(left, right),
		map(({beginModuloWeek, endModuloWeek}) => {
			return intersection(
				beginModuloWeek,
				endModuloWeek,
				dayModuloWeek,
				nextDayModuloWeek,
			);
		}, workSchedule),
	);

	const intervals: Iterable<{begin: Date; end: Date}> = filter(
		({begin, end}) => !isEmpty(begin, end),
		map(
			([i, [begin, end]]) => ({begin, end, isWorkScheduleSlot: i % 2 === 1}),
			enumerate(
				window(
					2,
					map(
						(m: number) => addMilliseconds(day, m - dayModuloWeek),
						[
							dayModuloWeek,
							...Array.from(intersectingWorkSchedule).flat(),
							nextDayModuloWeek,
						],
					),
				),
			),
		),
	);

	const thisMorning = startOfToday();
	const shownConsultations = consultations.filter(
		(c) =>
			(showConsultations || !c.isDone) &&
			(showAppointments || c.isDone) &&
			(showCancelledAppointments || c.isCancelled !== true) &&
			(showNoShowAppointments ||
				c.isDone ||
				Boolean(c.isCancelled) ||
				!isBefore(c.scheduledDatetime!, thisMorning)),
	);

	const heading = localizedDateFormat(day, 'PPPP');

	return (
		<Box>
			<Box>
				<Typography variant="h4">{heading}</Typography>
				{consultations.length === 0 ? (
					<NoContent>No events on this day</NoContent>
				) : shownConsultations.length === 0 ? (
					<NoContent>
						None of the {consultations.length} events matches the current filter
					</NoContent>
				) : (
					Array.from(intervals).map(({begin, end}, i) => {
						const items = shownConsultations
							.map((c) => {
								const [left, right] = intersection(begin, end, c.begin, c.end);
								if (isEmpty(left, right)) return undefined;
								return {
									...c,
									datetime: left,
								};
							})
							.filter(Boolean);
						if (items.length === 0) return null;
						return (
							<Grid key={i} container sx={{padding: 3}}>
								<Grid item sm={2} md={1}>
									<Box sx={{paddingRight: 2, textAlign: 'right'}}>
										<Typography variant="h5">{items.length}</Typography>
										<Typography variant="h6">{`${localizedDateFormat(
											begin,
											'p',
										)} - ${localizedDateFormat(end, 'p')}`}</Typography>
									</Box>
								</Grid>
								<Grid item sm={10} md={11}>
									<ConsultationsList
										items={items}
										loading={loading}
										itemProps={{
											PatientChip: ReactivePatientChip,
											showDate: false,
										}}
									/>
								</Grid>
							</Grid>
						);
					})
				)}
			</Box>
			<FixedFab
				col={5}
				color={showConsultations ? 'primary' : 'default'}
				tooltip={
					showConsultations ? 'Hide consultations' : 'Show consultations'
				}
				onClick={() => {
					setShowConsultations(!showConsultations);
				}}
			>
				<FolderSharedIcon />
			</FixedFab>
			<FixedFab
				col={4}
				color={showAppointments ? 'primary' : 'default'}
				tooltip={showAppointments ? 'Hide appointments' : 'Show appointments'}
				onClick={() => {
					setShowAppointments(!showAppointments);
				}}
			>
				<AccessTimeIcon />
			</FixedFab>
			{showAppointments && (
				<FixedFab
					col={7}
					color={showCancelledAppointments ? 'primary' : 'default'}
					tooltip={
						showCancelledAppointments
							? 'Hide cancelled appointments'
							: 'Show cancelled appointments'
					}
					onClick={() => {
						setShowCancelledAppointments(!showCancelledAppointments);
					}}
				>
					<AlarmOffIcon />
				</FixedFab>
			)}
			{showAppointments && (
				<FixedFab
					col={6}
					color={showNoShowAppointments ? 'primary' : 'default'}
					tooltip={
						showNoShowAppointments
							? 'Hide no-show appointments'
							: 'Show no-show appointments'
					}
					onClick={() => {
						setShowNoShowAppointments(!showNoShowAppointments);
					}}
				>
					<PhoneDisabledIcon />
				</FixedFab>
			)}
			<Prev to={`/calendar/day/${dayBefore}`} />
			<Next to={`/calendar/day/${dayAfter}`} />
		</Box>
	);
};

export default ConsultationsOfTheDay;
