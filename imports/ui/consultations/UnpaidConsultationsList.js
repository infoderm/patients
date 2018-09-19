import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import ConsultationCard from './ConsultationCard.js';

import { Consultations } from '../../api/consultations.js';

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

		const { classes, loading } = this.props ;

		if (loading) return <div>Loading...</div>;

		const { consultations } = this.props ;

		const unpaidConsultations = consultations.filter(consultation => consultation.paid !== consultation.price);

		if (unpaidConsultations.length === 0) return <div>All consultations have been paid for :)</div>;

		return (
			<div className={classes.container}>
				{ unpaidConsultations.map(consultation => ( <ConsultationCard key={consultation._id} consultation={consultation}/> )) }
			</div>
		);
	}

}

UnpaidConsultationsList.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withTracker(() => {
	const handle = Meteor.subscribe('consultations.unpaid');
	if ( !handle.ready() ) return { loading: true } ;
	return {
		loading: false,
		consultations: Consultations.find({}, {sort: {datetime: 1}}).fetch() ,
	} ;
}) ( withStyles(styles, { withTheme: true })(UnpaidConsultationsList) );
