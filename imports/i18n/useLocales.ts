import {useMemo} from 'react';

import useLocale from './useLocale';

const useLocales = (): string[] => {
	const locale = useLocale();
	return useMemo(() => [locale], [locale]);
};

export default useLocales;
