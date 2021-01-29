import React from 'react';

import {onlyLowerCaseASCII} from '../../api/string.js';

// import {settings} from '../../client/settings.js';

import InputManySetting from './InputManySetting.js';

const KEY = 'important-strings';

// TODO filter out items that are superstrings of others

const ImportantStringsSetting = ({className}) => {
	return (
		<InputManySetting
			className={className}
			title="Important Strings"
			label="Strings"
			setting={KEY}
			placeholder="Input important strings to highlight"
			inputTransform={onlyLowerCaseASCII}
			sort={(items) => items.sort()}
		/>
	);
};

export default ImportantStringsSetting;
