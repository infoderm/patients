import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { Consultations } from '../api/consultations.js';

import ConsultationCard from './ConsultationCard.js';

const styles = theme => ({
	container: {
		padding: theme.spacing.unit * 3,
	},
});

class ConsultationDetails extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			consultation: props.consultation,
		};
	}

	componentWillReceiveProps ( nextProps ) {
		this.setState({ consultation: nextProps.consultation });
	}


	render ( ) {

		const { classes, theme, loading } = this.props ;
		const { consultation } = this.state;

		if (loading) return <div>Loading...</div>;
		if (!consultation) return <div>Error: Consultation not found.</div>;

		return (
			<div>
				<div className={classes.container}>
					<ConsultationCard consultation={consultation} defaultExpanded={true}/>
				</div>
			</div>
		);
	}

}

ConsultationDetails.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withTracker(({match}) => {
	const _id = match.params.id;
	const handle = Meteor.subscribe('consultation', _id);
	if ( handle.ready() ) {
		const consultation = Consultations.findOne(_id);
		return { loading: false, consultation } ;
	}
	else return { loading: true } ;
}) ( withStyles(styles, { withTheme: true })(ConsultationDetails) );
