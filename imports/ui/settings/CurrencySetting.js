import React from 'react';

import SelectOneSetting from './SelectOneSetting.js';

export default class CurrencySetting extends React.Component {
	render() {
		const {className} = this.props;

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
				defaultValue="EUR"
			/>
		);
	}
}
