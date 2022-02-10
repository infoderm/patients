import React from 'react';

import SelectOneSetting from './SelectOneSetting';

const TextTransformSetting = ({className}) => {
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
};

export default TextTransformSetting;
