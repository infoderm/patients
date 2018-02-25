import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import addDays from 'date-fns/add_days'

import { Consultations } from '../api/consultations.js';

import ConsultationCard from './ConsultationCard.js';

const styles = theme => ({
	container: {
		padding: theme.spacing.unit * 3,
	},
});

class ConsultationsList extends React.Component {

	constructor ( props ) {
		super(props);
	}

	render ( ) {

		const { classes, consultations } = this.props ;

		return (
			<div className={classes.container}>
				{ consultations.map(consultation => ( <ConsultationCard key={consultation._id} consultation={consultation}/> )) }
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
	Meteor.subscribe('consultations');
	return {
		consultations: Consultations.find({ datetime : { $gte : day , $lt : nextDay } }, {sort: {datetime: -1}}).fetch() ,
	} ;
}) ( withStyles(styles, { withTheme: true })(ConsultationsList) );
