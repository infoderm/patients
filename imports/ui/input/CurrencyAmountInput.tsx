import React from 'react';

import {NumericFormat} from 'react-number-format';

import type PropsOf from '../../util/PropsOf';

import {useReactNumberFormatOptionsForCurrency} from '../../i18n/currency';

type Props = {
	currency: string;
	onChange: (e: any) => void;
} & PropsOf<typeof NumericFormat>;

const CurrencyAmountInput = React.forwardRef<any, Props>(
	({onChange, currency, ...rest}, ref) => {
		const currencyOptions = useReactNumberFormatOptionsForCurrency(currency);

		return (
			<NumericFormat
				{...rest}
				valueIsNumericString
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
