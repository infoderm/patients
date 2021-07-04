import {useMemo} from 'react';

import {useNumberFormat} from './number';

export const useCurrencyFormat = (currency: string, options?: any) => {
	const numberFormat = useNumberFormat({
		style: 'currency',
		currency,
		...options
	});

	return useMemo(() => {
		return (value: number | bigint) => numberFormat.format(value);
	}, [numberFormat]);
};
