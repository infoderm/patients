import React from 'react';

import tuple from '../../lib/types/tuple';

import SelectOneSetting from './SelectOneSetting';

const TextTransformSetting = ({className}) => {
	const options = tuple('none' as const, 'uppercase' as const);

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
