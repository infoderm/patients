import React from 'react';
import availableLocales, {
	localeDescriptions,
} from '../../i18n/availableLocales';
import {navigatorLocale} from '../../i18n/navigator';

import SelectOneSetting from './SelectOneSetting';

const options = ['navigator', ...availableLocales];
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
