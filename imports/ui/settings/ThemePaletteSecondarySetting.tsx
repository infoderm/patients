import React from 'react';

import SelectColorSetting from './SelectColorSetting';

interface Props {
	className?: string;
}

const ThemePaletteModeSetting = ({className}: Props) => {
	return (
		<SelectColorSetting
			className={className}
			title="Theme Secondary"
			setting="theme-palette-secondary"
		/>
	);
};

export default ThemePaletteModeSetting;
