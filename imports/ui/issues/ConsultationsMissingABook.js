import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react';

import ConsultationCard from '../consultations/ConsultationCard.js';

import { Consultations } from '../../api/consultations.js';

const ConsultationsMissingABook = ( { loading, consultations, ...rest } ) => {

	if (loading) return <div {...rest}>Loading...</div>;

	if (consultations.length === 0) return <div {...rest}>All consultations have a book :)</div>;

	return (
		<div {...rest}>
			{ consultations.map(consultation => ( <ConsultationCard key={consultation._id} consultation={consultation}/> )) }
		</div>
	);

}

export default withTracker(() => {
	const handle = Meteor.subscribe('consultations');
	if ( !handle.ready()) return { loading: true } ;
	return {
		loading: false,
		consultations: Consultations.find({
			$or: [
				{ book : null } ,
				{ book : '' } ,
			] ,
		}).fetch(),
	} ;
}) (ConsultationsMissingABook) ;
