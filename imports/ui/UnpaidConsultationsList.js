import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { Consultations } from '../api/consultations.js';

import ConsultationCard from './ConsultationCard.js';

const styles = theme => ({
	container: {
		padding: theme.spacing.unit * 3,
	},
});

class UnpaidConsultationsList extends React.Component {

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

UnpaidConsultationsList.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withTracker(() => {
	Meteor.subscribe('consultations.unpaid');
	return {
		consultations: Consultations.find({}, {sort: {datetime: 1}}).fetch() ,
	} ;
}) ( withStyles(styles, { withTheme: true })(UnpaidConsultationsList) );
