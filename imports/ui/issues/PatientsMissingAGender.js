import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import { Patients } from '../../api/patients.js';
import PatientCard from '../patients/PatientCard.js';
import IssueListPreview from './IssueListPreview.js';

const PatientsMissingAGender = ( { page, perpage, ...rest }) => {

	const subscription = 'issues/patients-missing-a-gender' ;
	const collection = Patients ;
	const query = {
		$or: [
			{ sex : null } ,
			{ sex : '' } ,
		] ,
	};
	const noIssueMessage = 'All patients have a gender :)' ;
	const createItem = patient => ( <PatientCard key={patient._id} patient={patient}/> ) ;
	const listPageURL = '/issues/patients-missing-a-gender' ;

	return <IssueListPreview
		page={page}
		perpage={perpage}
		subscription={subscription}
		collection={collection}
		query={query}
		noIssueMessage={noIssueMessage}
		createItem={createItem}
		listPageURL={listPageURL}
		Container={props => (<Grid container spacing={24} {...props}/>)}
	/> ;

}

PatientsMissingAGender.propTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
} ;

export default PatientsMissingAGender;
