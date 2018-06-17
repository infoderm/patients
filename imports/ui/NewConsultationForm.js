import { Meteor } from 'meteor/meteor';

import React from 'react' ;

import ConsultationForm from './ConsultationForm.js' ;

export default class NewConsultationForm extends React.Component {

	constructor(props){
		super(props);
	}

	render(){

		const { match } = this.props ;

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
		};

		return <ConsultationForm consultation={consultation}/> ;

	}
}
