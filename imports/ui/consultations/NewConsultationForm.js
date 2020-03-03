import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import startOfYear from 'date-fns/start_of_year';
import startOfToday from 'date-fns/start_of_today';
import addYears from 'date-fns/add_years';

import ConsultationForm from './ConsultationForm.js' ;

import { Consultations } from '../../api/consultations.js';
import { books } from '../../api/books.js';

class NewConsultationForm extends React.Component {

	constructor(props){
		super(props);
	}

	render(){

		const { match , loading , bookPrefill } = this.props ;

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
			payment_method: 'cash',
			price: 0,
			paid: 0,
			book: bookPrefill,
		};

		return <ConsultationForm consultation={consultation}/> ;

	}
}

export default withTracker(() => {

	const today = startOfToday();
	const beginningOfThisYear = startOfYear(today);
	const beginningOfNextYear = addYears(beginningOfThisYear, 1);

	const handle = Meteor.subscribe('consultations.accounted.interval.last', beginningOfThisYear, beginningOfNextYear);

	if ( handle.ready() ) {

		let bookPrefill = '1' ;

		const lastConsultationOfThisYear = Consultations.findOne(
			{
				datetime : {
					$gte : beginningOfThisYear ,
					$lt : beginningOfNextYear ,
				} ,
				isDone: true ,
				book : {
					$ne : '0' ,
				} ,
			},
			{
				sort: {
					datetime: -1 ,
					limit: 1 ,
				}
			} ,
		) ;

		if ( lastConsultationOfThisYear ) {

			const consultation = lastConsultationOfThisYear ;

			bookPrefill = consultation.book ;

			// // The code below will add + 1 when a book exceeds capacity
			//const name = books.name( consultation.datetime , consultation.book ) ;
			//const selector = books.selector( name ) ;
			//const count = Consultations.find( selector ).count();
			//if ( count >= books.MAX_CONSULTATIONS ) bookPrefill = ''+((+bookPrefill)+1) ;

		}

		return {
			loading: false,
			bookPrefill,
		} ;
	}
	else return { loading: true } ;
}) ( NewConsultationForm );
