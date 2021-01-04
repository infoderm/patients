import React from 'react';
import PropTypes from 'prop-types';

import {useHistory} from 'react-router-dom';

import {patients} from '../../api/patients.js';
const patientFilter = patients.filter;

import SearchBoxWithSuggestions from '../input/SearchBoxWithSuggestions.js';

export default function PatientsSearchBox({patients, className}) {
	const history = useHistory();

	const handleChange = (selectedItem, {clearSelection}) => {
		if (selectedItem) {
			history.push(`/patient/${selectedItem._id}`);
			clearSelection();
		}
	};

	const suggestions = patients.map((patient) => ({
		label: `${patient.lastname} ${patient.firstname}`,
		_id: patient._id
	}));

	return (
		<div className={className}>
			<SearchBoxWithSuggestions
				filter={patientFilter}
				suggestions={suggestions}
				itemToString={(item) => (item ? item.label : '')}
				itemToKey={(item) => item._id}
				placeholder="Search a patient…"
				onChange={handleChange}
			/>
		</div>
	);
}

PatientsSearchBox.propTypes = {
	patients: PropTypes.array.isRequired
};
