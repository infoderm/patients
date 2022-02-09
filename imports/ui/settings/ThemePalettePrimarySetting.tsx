import React from 'react';

import SelectColorSetting from './SelectColorSetting';

interface Props {
	className?: string;
}

const ThemePaletteModeSetting = ({className}: Props) => {
	return (
		<SelectColorSetting
			className={className}
			title="Theme Primary"
			setting="theme-palette-primary"
		/>
	);
};

export default ThemePaletteModeSetting;
