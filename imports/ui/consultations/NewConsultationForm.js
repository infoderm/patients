import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import startOfYear from 'date-fns/start_of_year';
import startOfToday from 'date-fns/start_of_today';
import addYears from 'date-fns/add_years';

import ConsultationForm from './ConsultationForm.js' ;

import { Consultations } from '../../api/consultations.js';

class NewConsultationForm extends React.Component {

	constructor(props){
		super(props);
	}

	render(){

		const { match , loading , lastConsultationOfThisYear } = this.props ;

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
			book: lastConsultationOfThisYear ? lastConsultationOfThisYear.book : '1',
		};

		return <ConsultationForm consultation={consultation}/> ;

	}
}

export default withTracker(() => {
	const handle = Meteor.subscribe('consultations');
	const today = startOfToday();
	const beginningOfThisYear = startOfYear(today);
	const beginningOfNextYear = addYears(beginningOfThisYear, 1);
	if ( handle.ready() ) {
		return {
			loading: false,
			lastConsultationOfThisYear: Consultations.findOne(
				{
					datetime : {
						$gte : beginningOfThisYear ,
						$lt : beginningOfNextYear ,
					}
				},
				{
					sort: {
						datetime: -1 ,
						limit: 1 ,
					}
				} ,
			) ,
		} ;
	}
	else return { loading: true } ;
}) ( NewConsultationForm );
