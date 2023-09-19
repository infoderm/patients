import React from 'react';

import tuple from '../../lib/types/tuple';

import SelectOneSetting from './SelectOneSetting';

type Props = {
	readonly className?: string;
};

const NavigationDrawerIsOpenSetting = ({className}: Props) => {
	const options = tuple('open' as const, 'closed' as const);

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
