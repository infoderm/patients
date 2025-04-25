import React from 'react';

import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';

import {useLocale} from '../../i18n/datetime';
import {useLocaleText} from '../../i18n/datePickers';

const DateTimeLocalizationProvider = ({children}) => {
	const locale = useLocale();
	const localeText = useLocaleText();
	return (
		<LocalizationProvider
			dateAdapter={AdapterDateFns}
			adapterLocale={locale}
			localeText={localeText}
		>
			{children}
		</LocalizationProvider>
	);
};

export default DateTimeLocalizationProvider;
