import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import { Consultations } from '../../api/consultations.js';
import ConsultationCard from '../consultations/ConsultationCard.js';
import IssueListPreview from './IssueListPreview.js';

const ConsultationsMissingABook = ( { page, perpage, ...rest }) => {

	const subscription = 'issues/consultations-missing-a-book' ;
	const collection = Consultations ;
	const query = {
		$or: [
			{ book : null } ,
			{ book : '' } ,
		] ,
	};
	const noIssueMessage = 'All consultations have a book :)' ;
	const createItem = consultation => ( <ConsultationCard key={consultation._id} consultation={consultation}/> ) ;
	const listPageURL = '/issues/consultations-missing-a-book' ;

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

ConsultationsMissingABook.propTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
} ;

export default ConsultationsMissingABook;
