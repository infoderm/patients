import React from 'react';

import SelectColorSetting from './SelectColorSetting';

type Props = {
	readonly className?: string;
};

const ThemePaletteModeSetting = ({className}: Props) => {
	return (
		<SelectColorSetting
			aria-label="Secondary color for theme"
			className={className}
			title="Theme Secondary"
			setting="theme-palette-secondary"
		/>
	);
};

export default ThemePaletteModeSetting;
