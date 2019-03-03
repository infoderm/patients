import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import { Patients } from '../../api/patients.js';
import PatientCard from '../patients/PatientCard.js';
import IssueListPreview from './IssueListPreview.js';

const PatientsMissingABirthdate = ( { page, perpage, ...rest }) => {

	const subscription = 'issues/patients-missing-a-birthdate' ;
	const collection = Patients ;
	const query = {
		$or: [
			{ birthdate : null } ,
			{ birthdate : '' } ,
		] ,
	};
	const noIssueMessage = 'All patients have a birthdate :)' ;
	const createItem = patient => ( <PatientCard key={patient._id} patient={patient}/> ) ;
	const listPageURL = '/issues/patients-missing-a-birthdate' ;

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

PatientsMissingABirthdate.propTypes = {
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
} ;

export default PatientsMissingABirthdate;
