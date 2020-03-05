import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import ConsultationCard from './ConsultationCard.js';

import { Consultations } from '../../api/consultations.js';

const styles = theme => ({
	container: {
		padding: theme.spacing(3),
	},
});

class WiredConsultationsList extends React.Component {

	constructor ( props ) {
		super(props);
	}

	render ( ) {

		const { classes, loading } = this.props ;

		if (loading) return <div>Loading...</div>;

		const { consultations } = this.props ;

		if (consultations.length === 0) return <div>No wire transfer</div>;

		return (
			<div className={classes.container}>
				{
					consultations.map(
						consultation => (
							<ConsultationCard
								showPrice
								key={consultation._id}
								consultation={consultation}
							/>
						)
					)
				}
			</div>
		);
	}

}

WiredConsultationsList.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withTracker(() => {
	const handle = Meteor.subscribe('consultations.wired');
	if ( !handle.ready() ) return { loading: true } ;
	return {
		loading: false,
		consultations: Consultations.find({
			isDone: true,
			payment_method: 'wire',
		}, {sort: {datetime: 1}}).fetch() ,
	} ;
}) ( withStyles(styles, { withTheme: true })(WiredConsultationsList) );
