import React from 'react';

import PropTypes from 'prop-types';

import Paginator from '../navigation/Paginator.js';

import ReactivePatientCard from './ReactivePatientCard.js';
import PatientsPage from './PatientsPage.js';

export default function PagedPatientsList({root, page, perpage, items}) {
	return (
		<>
			<PatientsPage patients={items} Card={ReactivePatientCard} />
			<Paginator page={page} end={items.length < perpage} root={root} />
		</>
	);
}

PagedPatientsList.projection = {
	firstname: 1,
	lastname: 1,
	birthdate: 1,
	sex: 1,
	niss: 1
};

PagedPatientsList.propTypes = {
	root: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
	items: PropTypes.array.isRequired
};
