import React from 'react';

import {onlyLowerCaseASCII} from '../../api/string.js';

// import {settings} from '../../client/settings.js';

import InputManySetting from './InputManySetting.js';

const KEY = 'important-strings';

export default class ImportantStringsSetting extends React.Component {
	render() {
		const {className} = this.props;

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
	}
}
