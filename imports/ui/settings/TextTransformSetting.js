import React from 'react';

import SelectOneSetting from './SelectOneSetting.js';

export default class TextTransformSetting extends React.Component {
	render() {
		const {className} = this.props;

		const options = ['none', 'uppercase'];

		return (
			<SelectOneSetting
				className={className}
				title="Text Transform"
				label="text-transform"
				setting="text-transform"
				options={options}
			/>
		);
	}
}
