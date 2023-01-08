import React from 'react';

import SelectOneSetting from './SelectOneSetting';

type Props = {
	className?: string;
};

const ThemePaletteModeSetting = ({className}: Props) => {
	const options = ['light', 'dark'];

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
