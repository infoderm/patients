import React from 'react';

import SelectColorSetting from './SelectColorSetting';

type Props = {
	readonly className?: string;
};

const ThemePaletteModeSetting = ({className}: Props) => {
	return (
		<SelectColorSetting
			aria-label="Primary color for theme"
			className={className}
			title="Theme Primary"
			setting="theme-palette-primary"
		/>
	);
};

export default ThemePaletteModeSetting;
