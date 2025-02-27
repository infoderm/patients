import React from 'react';

import InputOneSetting from './InputOneSetting';

type Props = {
	readonly className?: string;
};

export default function AccountHolderSetting({className}: Props) {
	return (
		<InputOneSetting
			className={className}
			setting="account-holder"
			label="Account Holder"
		/>
	);
}
