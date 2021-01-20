import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import {format} from 'date-fns';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import addHours from 'date-fns/addHours';
import isBefore from 'date-fns/isBefore';

import {count} from '@aureooms/js-cardinality';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

import {TIME_BREAK} from '../../client/constants.js';

import Prev from '../navigation/Prev.js';
import Next from '../navigation/Next.js';
import {computeFixedFabStyle} from '../button/FixedFab.js';

import ReactiveConsultationCard from './ReactiveConsultationCard.js';
import ReactivePatientChip from '../patients/ReactivePatientChip.js';

import {useConsultationsAndAppointments} from '../../api/consultations.js';

const useStyles = makeStyles((theme) => ({
	container: {
		padding: theme.spacing(3)
	},
	consultationsToggle: computeFixedFabStyle({theme, col: 5}),
	appointmentsToggle: computeFixedFabStyle({theme, col: 4})
}));

const ConsultationsOfTheDay = ({day}) => {
	const [showConsultations, setShowConsultations] = useState(true);
	const [showAppointments, setShowAppointments] = useState(true);

	const prevDay = subDays(day, 1);
	const nextDay = addDays(day, 1);

	const query = {datetime: {$gte: day, $lt: nextDay}};
	const options = {sort: {datetime: 1}};
	const deps = [Number(day), Number(nextDay)];
	const {results: consultations} = useConsultationsAndAppointments(
		query,
		options,
		deps
	);

	const classes = useStyles();

	const dayBefore = format(prevDay, 'yyyy-MM-dd');
	const dayAfter = format(nextDay, 'yyyy-MM-dd');

	const pause = addHours(day, TIME_BREAK);
	const am = consultations.filter(
		(c) =>
			isBefore(c.datetime, pause) &&
			(showConsultations || c.isDone === false) &&
			(showAppointments || c.isDone !== false)
	);
	const pm = consultations.filter(
		(c) =>
			!isBefore(c.datetime, pause) &&
			(showConsultations || c.isDone === false) &&
			(showAppointments || c.isDone !== false)
	);
	const cam = count(am);
	const cpm = count(pm);

	return (
		<>
			<div>
				<Typography variant="h3">{`${format(
					day,
					'iiii do MMMM yyyy'
				)} (AM: ${cam}, PM: ${cpm})`}</Typography>
				{cam === 0 ? (
					''
				) : (
					<div className={classes.container}>
						{am.map((consultation) => (
							<ReactiveConsultationCard
								key={consultation._id}
								consultation={consultation}
								PatientChip={ReactivePatientChip}
							/>
						))}
					</div>
				)}
				{cpm === 0 || cam === 0 ? '' : <Divider />}
				{cpm === 0 ? (
					''
				) : (
					<div className={classes.container}>
						{pm.map((consultation) => (
							<ReactiveConsultationCard
								key={consultation._id}
								consultation={consultation}
								PatientChip={ReactivePatientChip}
							/>
						))}
					</div>
				)}
			</div>
			<Fab
				className={classes.consultationsToggle}
				color={showConsultations ? 'primary' : 'default'}
				onClick={() => setShowConsultations(!showConsultations)}
			>
				<FolderSharedIcon />
			</Fab>
			<Fab
				className={classes.appointmentsToggle}
				color={showAppointments ? 'primary' : 'default'}
				onClick={() => setShowAppointments(!showAppointments)}
			>
				<AccessTimeIcon />
			</Fab>
			<Prev to={`/calendar/day/${dayBefore}`} />
			<Next to={`/calendar/day/${dayAfter}`} />
		</>
	);
};

ConsultationsOfTheDay.propTypes = {
	day: PropTypes.object.isRequired
};

export default ConsultationsOfTheDay;
