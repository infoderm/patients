import React from 'react';

import IBAN from 'iban';
import InputOneSetting from './InputOneSetting';

export default function IBANSetting({className}) {
	return (
		<InputOneSetting
			className={className}
			setting="iban"
			label="IBAN"
			sanitize={(s) => s.trim()}
			validate={(s) => ({
				outcome: IBAN.isValid(s) ? 1 : 0,
			})}
		/>
	);
}
