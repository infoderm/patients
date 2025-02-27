import React from 'react';

import InputOneSetting from './InputOneSetting';

export default function AccountHolderSetting({className}) {
	return (
		<InputOneSetting
			className={className}
			setting="account-holder"
			label="Account Holder"
		/>
	);
}
