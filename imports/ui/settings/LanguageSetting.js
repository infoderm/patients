import React from 'react';

import {localeDescriptions as LANGUAGES} from '../../i18n/datetime';
import SelectOneSetting from './SelectOneSetting';

const LanguageSetting = ({className}) => {
	const options = [...Object.keys(LANGUAGES)];

	const optionToString = (x) => LANGUAGES[x];

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
