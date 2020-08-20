import React from 'react';

import InputOneSetting from './InputOneSetting.js';
import IBAN from 'iban';

export default function IBANSetting() {
	return (
		<InputOneSetting
			setting="iban"
			label="IBAN"
			sanitize={(s) => s.trim()}
			validate={(s) => ({
				outcome: IBAN.isValid(s) ? 1 : 0
			})}
		/>
	);
}
