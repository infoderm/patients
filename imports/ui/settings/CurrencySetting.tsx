import React from 'react';
import availableCurrencies, {
	type AvailableCurrency,
	currencyDescriptions,
} from '../../i18n/availableCurrencies';

import SelectOneSetting from './SelectOneSetting';

const CurrencySetting = ({className}) => {
	const options = [...availableCurrencies];
	const optionToString = (option: AvailableCurrency) =>
		currencyDescriptions[option];

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
