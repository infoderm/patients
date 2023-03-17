import React from 'react';
import availableLocales, {
	localeDescriptions,
} from '../../i18n/availableLocales';
import {navigatorLocale} from '../../i18n/navigator';
import tuple from '../../lib/types/tuple';

import SelectOneSetting from './SelectOneSetting';

const options = tuple('navigator' as const, ...availableLocales);
const optionToString = (x: string) =>
	x === 'navigator'
		? `${localeDescriptions[navigatorLocale()]} (same as navigator)`
		: localeDescriptions[x];

const LanguageSetting = ({className}) => {
	return (
		<SelectOneSetting
			className={className}
			title="Language"
			label="Language"
			setting="lang"
			options={options}
			optionToString={optionToString}
		/>
	);
};

export default LanguageSetting;
