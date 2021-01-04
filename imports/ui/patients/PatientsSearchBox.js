import React from 'react';

import {useHistory} from 'react-router-dom';

import {patients} from '../../api/patients.js';

import SearchBoxWithSuggestions from '../input/SearchBoxWithSuggestions.js';
import usePatientsSuggestions from './usePatientsSuggestions.js';

const PatientsSearchBox = ({className}) => {
	const history = useHistory();

	const handleChange = (selectedItem, {clearSelection}) => {
		if (selectedItem) {
			history.push(`/patient/${selectedItem._id}`);
			clearSelection();
		}
	};

	return (
		<div className={className}>
			<SearchBoxWithSuggestions
				useSuggestions={usePatientsSuggestions}
				itemToString={(item) => (item ? patients.toString(item) : '')}
				itemToKey={patients.toKey}
				placeholder="Search a patient…"
				onChange={handleChange}
			/>
		</div>
	);
};

export default PatientsSearchBox;
