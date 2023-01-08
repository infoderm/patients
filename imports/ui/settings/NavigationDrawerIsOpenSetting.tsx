import React from 'react';

import SelectOneSetting from './SelectOneSetting';

type Props = {
	className?: string;
};

const NavigationDrawerIsOpenSetting = ({className}: Props) => {
	const options = ['open', 'closed'];

	return (
		<SelectOneSetting
			className={className}
			title="Navigation Drawer State"
			label="State"
			setting="navigation-drawer-is-open"
			options={options}
		/>
	);
};

export default NavigationDrawerIsOpenSetting;
