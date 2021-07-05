import {useMemo} from 'react';

import {useNumberFormat} from './number';

export const useCurrencyFormatObject = (currency: string, options?: any) => {
	return useNumberFormat({
		style: 'currency',
		currency,
		...options
	});
};

export const useCurrencyFormat = (currency: string, options?: any) => {
	const numberFormat = useCurrencyFormatObject(currency, options);

	return useMemo(() => {
		return (value: number | bigint) => numberFormat.format(value);
	}, [numberFormat]);
};
