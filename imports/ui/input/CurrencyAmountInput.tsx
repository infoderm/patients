import React from 'react';

import NumberFormat from 'react-number-format';

import PropsOf from '../../util/PropsOf';

import {useReactNumberFormatOptionsForCurrency} from '../../i18n/currency';

interface Props extends PropsOf<typeof NumberFormat> {
	currency: string;
	onChange: (e: any) => void;
}

const CurrencyAmountInput = React.forwardRef<any, Props>(
	({onChange, currency, ...rest}, ref) => {
		const currencyOptions = useReactNumberFormatOptionsForCurrency(currency);

		return (
			<NumberFormat
				{...rest}
				isNumericString
				getInputRef={ref}
				onValueChange={({value}) => {
					if (rest.value === value) return;
					onChange({
						target: {
							value,
						},
					});
				}}
				{...currencyOptions}
			/>
		);
	},
);

export default CurrencyAmountInput;
