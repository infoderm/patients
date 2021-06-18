import React from 'react';

import SelectOneSetting from './SelectOneSetting';

const CurrencySetting = ({className}) => {
	const CURRENCIES = {
		EUR: '€'
	};

	const options = [...Object.keys(CURRENCIES)];

	const optionToString = (option) => CURRENCIES[option];

	return (
		<SelectOneSetting
			className={className}
			label="currency"
			setting="currency"
			options={options}
			optionToString={optionToString}
		/>
	);
};

export default CurrencySetting;
