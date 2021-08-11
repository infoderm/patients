import React from 'react';

import NumberFormat from 'react-number-format';

import {useReactNumberFormatOptionsForCurrency} from '../../i18n/currency';

const CurrencyAmountInput = ({inputRef, onChange, currency, ...other}) => {
	const currencyOptions = useReactNumberFormatOptionsForCurrency(currency);

	return (
		<NumberFormat
			{...other}
			isNumericString
			getInputRef={inputRef}
			onValueChange={({value}) => {
				if (other.value === value) return;
				onChange({
					target: {
						value,
					},
				});
			}}
			{...currencyOptions}
		/>
	);
};

export default CurrencyAmountInput;
