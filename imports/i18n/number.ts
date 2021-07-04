import {useMemo} from 'react';

import useLocales from './useLocales';

export const useNumberFormat = (options: any) => {
	const locales = useLocales();
	return useMemo(() => {
		return new Intl.NumberFormat(locales, options);
	}, [JSON.stringify(options), ...locales]);
};
