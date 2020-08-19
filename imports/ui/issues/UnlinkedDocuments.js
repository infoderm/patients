import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react';

import { sorted } from '@aureooms/js-itertools' ;

import { Documents } from '../../api/documents.js' ;

import DocumentsPage from '../documents/DocumentsPage.js' ;

const UnlinkedDocuments = ( { loading, documents, ...rest } ) => {

	if (loading) return <div {...rest}>Loading...</div>;

	if (documents.length === 0) return <div {...rest}>All documents have an assigned patient :)</div>;

	const order = (a, b) =>
	!a.patient ? b.patient ? 1 : a.createdAt - b.createdAt
	: !b.patient ? -1
	:
	a.patient.lastname < b.patient.lastname ? -1
	:
	a.patient.lastname > b.patient.lastname ? 1
	:
	a.patient.firstname < b.patient.firstname ? -1
	:
	a.patient.firstname > b.patient.firstname ? 1
	:
	a.datetime < b.datetime ? -1
	:
	a.datetime > b.datetime ? 1
	:
	a.createdAt - b.createdAt;

	const sortedDocuments = sorted(order, documents) ;

	return (
		<div {...rest}>
			<DocumentsPage documents={sortedDocuments}/>
		</div>
	);

}

export default withTracker(() => {
	const options = {
		sort: {
			createdAt: 1,
		},
		fields: {
			...DocumentsPage.projection,
			patientId: 1,
		},
	};
	const handle = Meteor.subscribe('documents.unlinked', options);
	if ( !handle.ready()) return { loading: true } ;
	return {
		loading: false,
		documents: Documents.find({
			patientId: null
		}, options).fetch(),
	} ;
}) (UnlinkedDocuments) ;
