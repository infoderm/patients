import {useMemo} from 'react';

import useLocales from './useLocales';

export const useNumberFormat = (options: any) => {
	const locales = useLocales();
	return useMemo(() => {
		try {
			return new Intl.NumberFormat(locales, options);
		} catch (error: unknown) {
			if (error instanceof TypeError) {
				return undefined;
			}

			throw error;
		}
	}, [JSON.stringify(options), locales]);
};
