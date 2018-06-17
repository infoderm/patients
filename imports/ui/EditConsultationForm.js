import { Meteor } from 'meteor/meteor';

import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import ConsultationForm from './ConsultationForm.js' ;

class NewConsultationForm extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			consultation: props.consultation,
		};
	}

	componentWillReceiveProps ( nextProps ) {
		this.setState({ consultation: nextProps.consultation });
	}


	render(){

		const { loading } = this.props ;
		const { consultation } = this.state;

		if (loading) return <div>Loading...</div>;
		if (!consultation) return <div>Error: Consultation not found.</div>;

		return <ConsultationFrom consultation={consultation}/> ;

	}
}

export default withTracker(({match}) => {
	const _id = match.params.id;
	const handle = Meteor.subscribe('consultation', _id);
	if ( handle.ready() ) {
		const consultation = Consultations.findOne(_id);
		return { loading: false, consultation } ;
	}
	else return { loading: true } ;
}) ( ConsultationDetails );
