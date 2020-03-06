import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';

import { format } from 'date-fns' ;
import addDays from 'date-fns/addDays' ;
import subDays from 'date-fns/subDays' ;
import addHours from 'date-fns/addHours' ;
import isBefore from 'date-fns/isBefore' ;

import { count } from '@aureooms/js-cardinality' ;

import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Divider from '@material-ui/core/Divider';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import ConsultationCard from './ConsultationCard.js';

import { Consultations } from '../../api/consultations.js';

const styles = theme => ({
	container: {
		padding: theme.spacing(3),
	},
	fabprev: {
		position: 'fixed',
		bottom: theme.spacing(3),
		right: theme.spacing(12),
	},
	fabnext: {
		position: 'fixed',
		bottom: theme.spacing(3),
		right: theme.spacing(3),
	},
});

class ConsultationsList extends React.Component {

	constructor ( props ) {
		super(props);
	}

	render ( ) {

		const { classes, day, consultations } = this.props ;

		const dayBefore = format( subDays(day, 1), 'yyyy-MM-dd' ) ;
		const dayAfter = format( addDays(day, 1), 'yyyy-MM-dd' ) ;

		const pause = addHours(day, 15);
		const am = consultations.filter(c => isBefore(c.datetime, pause));
		const pm = consultations.filter(c => !isBefore(c.datetime, pause));
		const cam = count(am);
		const cpm = count(pm);

		return (
			<div>
				<Typography variant="h3">{`${format(day, 'iiii do MMMM yyyy')} (AM: ${cam}, PM: ${cpm})`}</Typography>
				{ cam === 0 ? '' :
				<div className={classes.container}>
					{ am.map(consultation => ( <ConsultationCard key={consultation._id} consultation={consultation}/> )) }
				</div> }
				{ cpm === 0 || cam === 0 ? '' : <Divider/>}
				{ cpm === 0 ? '' :
				<div className={classes.container}>
					{ pm.map(consultation => ( <ConsultationCard key={consultation._id} consultation={consultation}/> )) }
				</div> }
				<Fab className={classes.fabprev} color="primary" component={Link} to={`/calendar/${dayBefore}`}>
					<NavigateBeforeIcon/>
				</Fab>
				<Fab className={classes.fabnext} color="primary" component={Link} to={`/calendar/${dayAfter}`}>
					<NavigateNextIcon/>
				</Fab>
			</div>
		);
	}

}

ConsultationsList.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	day: PropTypes.object.isRequired,
};

export default withTracker(({ day }) => {
	const nextDay = addDays(day, 1);
	Meteor.subscribe('consultations.interval', day, nextDay);
	return {
		day,
		consultations: Consultations.find({ datetime : { $gte : day , $lt : nextDay } }, {sort: {datetime: 1}}).fetch() ,
	} ;
}) ( withStyles(styles, { withTheme: true })(ConsultationsList) );
