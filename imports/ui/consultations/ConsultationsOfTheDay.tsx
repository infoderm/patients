import React, {useMemo, useState} from 'react';

import {styled} from '@mui/material/styles';

import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import addHours from 'date-fns/addHours';
import isBefore from 'date-fns/isBefore';
import startOfToday from 'date-fns/startOfToday';
import startOfDay from 'date-fns/startOfDay';

import {count} from '@iterable-iterator/cardinality';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';

import {TIME_BREAK} from '../constants';

import Prev from '../navigation/Prev';
import Next from '../navigation/Next';
import FixedFab from '../button/FixedFab';

import ReactivePatientChip from '../patients/ReactivePatientChip';

import {useDateFormat} from '../../i18n/datetime';

import useConsultationsAndAppointments from './useConsultationsAndAppointments';
import ConsultationsList from './ConsultationsList';

const PREFIX = 'ConsultationsOfTheDay';

const classes = {
	container: `${PREFIX}-container`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({theme}) => ({
	[`& .${classes.container}`]: {
		padding: theme.spacing(3),
	},
}));

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

	const filter = {datetime: {$gte: day, $lt: nextDay}};
	const query = {
		filter,
		sort: {datetime: 1} as const,
	};
	const deps = [Number(day)];
	const {loading, results: consultations} = useConsultationsAndAppointments(
		query,
		deps,
	);

	const thisMorning = startOfToday();
	const am = consultations.filter(
		(c) =>
			isBefore(c.datetime, addHours(startOfDay(c.datetime), TIME_BREAK)) &&
			(showConsultations || !c.isDone) &&
			(showAppointments || c.isDone) &&
			(showCancelledAppointments || c.isCancelled !== true) &&
			(showNoShowAppointments ||
				c.isDone ||
				Boolean(c.isCancelled) ||
				!isBefore(c.scheduledDatetime!, thisMorning)),
	);
	const pm = consultations.filter(
		(c) =>
			!isBefore(c.datetime, addHours(startOfDay(c.datetime), TIME_BREAK)) &&
			(showConsultations || !c.isDone) &&
			(showAppointments || c.isDone) &&
			(showCancelledAppointments || c.isCancelled !== true) &&
			(showNoShowAppointments ||
				c.isDone ||
				Boolean(c.isCancelled) ||
				!isBefore(c.scheduledDatetime!, thisMorning)),
	);
	const cam = count(am);
	const cpm = count(pm);

	const heading = `${localizedDateFormat(
		day,
		'PPPP',
	)} (AM: ${cam}, PM: ${cpm})`;

	return (
		<Root>
			<div>
				<Typography variant="h4">{heading}</Typography>
				{cam === 0 ? null : (
					<ConsultationsList
						className={classes.container}
						items={am}
						loading={loading}
						itemProps={{
							PatientChip: ReactivePatientChip,
							showDate: false,
						}}
					/>
				)}
				{cpm === 0 || cam === 0 ? null : <Divider />}
				{cpm === 0 ? null : (
					<ConsultationsList
						className={classes.container}
						items={pm}
						loading={loading}
						itemProps={{
							PatientChip: ReactivePatientChip,
							showDate: false,
						}}
					/>
				)}
			</div>
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
		</Root>
	);
};

export default ConsultationsOfTheDay;
