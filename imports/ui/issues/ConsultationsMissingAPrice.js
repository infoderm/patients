import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import { Consultations } from '../../api/consultations.js';
import ConsultationCard from '../consultations/ConsultationCard.js';
import IssueListPreview from './IssueListPreview.js';

const ConsultationsMissingAPrice = ( { page, perpage, ...rest }) => {

	const subscription = 'issues/consultations-missing-a-price' ;
	const collection = Consultations ;
	const query = {
		$or: [
			{ price : { $not: { $type: 1 } } } ,
			{ price : NaN } ,
		] ,
	};
	const noIssueMessage = 'All consultations have a price :)' ;
	const createItem = consultation => ( <ConsultationCard key={consultation._id} consultation={consultation}/> ) ;
	const listPageURL = '/issues/consultations-missing-a-price' ;

	return <IssueListPreview
		page={page}
		perpage={perpage}
		subscription={subscription}
		collection={collection}
		query={query}
		noIssueMessage={noIssueMessage}
		createItem={createItem}
		listPageURL={listPageURL}
		Container={props => (<div {...props}/>)}
	/> ;

}

ConsultationsMissingAPrice.propTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
} ;

export default ConsultationsMissingAPrice;
