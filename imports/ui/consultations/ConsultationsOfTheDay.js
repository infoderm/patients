import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
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

import {TIME_BREAK} from '../../client/constants.js';

import Prev from '../navigation/Prev.js';
import Next from '../navigation/Next.js';

import StaticConsultationCard from './StaticConsultationCard.js';
import ReactivePatientChip from '../patients/ReactivePatientChip.js';

import {Consultations} from '../../api/consultations.js';

const useStyles = makeStyles((theme) => ({
	container: {
		padding: theme.spacing(3)
	}
}));

const ConsultationsOfTheDay = (props) => {
	const {day, consultations} = props;

	const classes = useStyles();

	const dayBefore = format(subDays(day, 1), 'yyyy-MM-dd');
	const dayAfter = format(addDays(day, 1), 'yyyy-MM-dd');

	const pause = addHours(day, TIME_BREAK);
	const am = consultations.filter((c) => isBefore(c.datetime, pause));
	const pm = consultations.filter((c) => !isBefore(c.datetime, pause));
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
							<StaticConsultationCard
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
							<StaticConsultationCard
								key={consultation._id}
								consultation={consultation}
								PatientChip={ReactivePatientChip}
							/>
						))}
					</div>
				)}
			</div>
			<Prev to={`/calendar/day/${dayBefore}`} />
			<Next to={`/calendar/day/${dayAfter}`} />
		</>
	);
};

ConsultationsOfTheDay.propTypes = {
	day: PropTypes.object.isRequired
};

export default withTracker(({day}) => {
	const nextDay = addDays(day, 1);
	Meteor.subscribe('consultations.interval', day, nextDay);
	return {
		day,
		consultations: Consultations.find(
			{datetime: {$gte: day, $lt: nextDay}},
			{sort: {datetime: 1}}
		).fetch()
	};
})(ConsultationsOfTheDay);
