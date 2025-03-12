import React from 'react';

import tuple from '../../util/types/tuple';

import SelectOneSetting from './SelectOneSetting';

type Props = {
	readonly className?: string;
};

const ThemePaletteModeSetting = ({className}: Props) => {
	const options = tuple('light' as const, 'dark' as const);

	return (
		<SelectOneSetting
			className={className}
			title="Theme Mode"
			label="Mode"
			setting="theme-palette-mode"
			options={options}
		/>
	);
};

export default ThemePaletteModeSetting;
