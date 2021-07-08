import React from 'react';

import {onlyLowerCaseASCII} from '../../api/string';

// import {settings} from '../../client/settings';

import InputManySetting from './InputManySetting';

const KEY = 'important-strings';

const sort = (items) => items.slice().sort();

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
			sort={sort}
		/>
	);
};

export default ImportantStringsSetting;
