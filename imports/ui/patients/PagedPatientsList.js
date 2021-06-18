import React from 'react';

import PropTypes from 'prop-types';

import Paginator from '../navigation/Paginator';
import Refresh from '../navigation/Refresh';

import ReactivePatientCard from './ReactivePatientCard';
import PatientsPage from './PatientsPage';

export default function PagedPatientsList({
	root,
	page,
	perpage,
	items,
	refresh,
	dirty
}) {
	return (
		<>
			<PatientsPage patients={items} Card={ReactivePatientCard} />
			<Paginator page={page} end={items.length < perpage} root={root} />
			{refresh && dirty && <Refresh onClick={refresh} />}
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

PagedPatientsList.defaultProps = {
	dirty: false,
	refresh: undefined
};

PagedPatientsList.propTypes = {
	root: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
	items: PropTypes.array.isRequired,
	refresh: PropTypes.func,
	dirty: PropTypes.bool
};
