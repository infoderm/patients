import React, {useCallback} from 'react';

import availableLocales, {
	localeDescriptions,
} from '../../i18n/availableLocales';
import {useNavigatorLocale} from '../../i18n/navigator';
import tuple from '../../util/types/tuple';

import SelectOneSetting from './SelectOneSetting';

const options = tuple('navigator' as const, ...availableLocales);

const LanguageSetting = ({className}) => {
	const navigatorLocale = useNavigatorLocale();

	const optionToString = useCallback(
		(x: string) =>
			x === 'navigator'
				? `${localeDescriptions[navigatorLocale]} (same as navigator)`
				: localeDescriptions[x],
		[navigatorLocale],
	);

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
