import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Patients } from '../../api/patients.js';

import PagedPatientsList from '../patients/PagedPatientsList.js';

class DoctorDetails extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
		};
	}

	render ( ) {
		const { name , page , perpage , patients } = this.props ;
		return (
			<PagedPatientsList root={`/doctor/${name}`} page={page} perpage={perpage} patients={patients}/>
		) ;
	}

}

DoctorDetails.propTypes = {
	name: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
	patients: PropTypes.array.isRequired,
} ;

export default withTracker(({match}) => {
	const name = match.params.name ;
	const page = ( match.params.page && parseInt(match.params.page, 10) ) || 0 ;
	const perpage = 10 ;
	Meteor.subscribe('patients-of-doctor', name);
	return {
		name,
		page,
		perpage,
		patients: Patients.find({doctor: name}, {sort: { lastname: 1 }, skip: page*perpage, limit: perpage}).fetch()
	} ;
}) ( DoctorDetails );
