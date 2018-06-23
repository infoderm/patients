import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import ConsultationForm from './ConsultationForm.js' ;

import { Consultations } from '../api/consultations.js';

class NewConsultationForm extends React.Component {

	constructor(props){
		super(props);
	}

	render(){

		const { match , loading , lastConsultation } = this.props ;

		if ( loading ) return 'Loading...' ;

		const consultation = {
			_id: undefined,
			patientId: match.params.id,
			datetime: new Date(),
			reason: '',
			done: '',
			todo: '',
			treatment: '',
			next: '',
			more: '',
			currency: 'EUR',
			price: 0,
			paid: 0,
			book: lastConsultation ? lastConsultation.book : '',
		};

		return <ConsultationForm consultation={consultation}/> ;

	}
}

export default withTracker(() => {
	const handle = Meteor.subscribe('consultations');
	if ( handle.ready() ) {
		return {
			loading: false,
			lastConsultation: Consultations.findOne({}, {sort: {datetime: -1, limit: 1}}) ,
		} ;
	}
	else return { loading: true } ;
}) ( NewConsultationForm );
