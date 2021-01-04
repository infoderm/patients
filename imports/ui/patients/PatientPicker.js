import React from 'react';

import {patients, usePatientsAdvancedFind} from '../../api/patients.js';
import {normalizeSearch} from '../../api/string.js';

import SetPicker from '../input/SetPicker.js';

const useSuggestions = (searchString) => {
	const $search = normalizeSearch(searchString);
	const limit = 5;

	const query = {$text: {$search}};

	const sort = {
		score: {$meta: 'textScore'}
	};
	const fields = {
		...sort,
		_id: 1,
		firstname: 1,
		lastname: 1
	};

	const options = {
		fields,
		sort,
		skip: 0,
		limit
	};

	return usePatientsAdvancedFind(query, options, [
		$search
		// refreshKey,
	]);
};

const PatientPicker = ({...rest}) => {

	return (
		<SetPicker
			itemToKey={patients.toKey}
			itemToString={patients.toString}
			useSuggestions={useSuggestions}
			maxCount={1}
			{...rest}
		/>
	);

};

export default PatientPicker;
