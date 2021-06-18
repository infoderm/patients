import React from 'react';

import InputOneSetting from './InputOneSetting';

export default function IBANSetting({className}) {
	return (
		<InputOneSetting
			className={className}
			setting="account-holder"
			label="Account Holder"
		/>
	);
}
