import {withTracker} from 'meteor/react-meteor-data';

import React, {useState} from 'react';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';

import {settings} from '../../client/settings.js';

import SEPAPaymentQRCode from './SEPAPaymentQRCode.js';

const SEPAPaymentDetails = (props) => {
	const {accountHolder, iban, currency} = props;

	const defaultReference = format(startOfToday(), 'yyyy-MM-dd');

	const [amount, setAmount] = useState(0.01);
	const [amountString, setAmountString] = useState(amount.toString());
	const [unstructuredReference, setUnstructuredReference] = useState(
		defaultReference
	);

	const handleAmountChange = (e) => {
		setAmountString(e.target.value);
		setAmount(Number.parseFloat(e.target.value, 10));
	};

	const data = {
		name: accountHolder,
		iban,
		currency,
		amount: Number.isNaN(amount) ? 0 : amount
	};

	if (unstructuredReference) {
		data.unstructuredReference = unstructuredReference;
	}

	const codeProps = {
		level: 'H',
		size: 256
	};

	return (
		<div>
			<Typography variant="h3">SEPA Wire</Typography>
			<div>
				<TextField readOnly label="Account Holder" value={accountHolder} />
			</div>
			<div>
				<TextField readOnly label="IBAN" value={iban} />
			</div>
			<div>
				<TextField readOnly label="Currency" value={currency} />
			</div>
			<div>
				<TextField
					label="Amount"
					value={amountString}
					error={Number.isNaN(amount)}
					onChange={handleAmountChange}
				/>
			</div>
			<div>
				<TextField
					label="Reference"
					value={unstructuredReference}
					onChange={(e) => setUnstructuredReference(e.target.value)}
				/>
			</div>
			<div>
				<SEPAPaymentQRCode data={data} codeProps={codeProps} />
			</div>
		</div>
	);
};

export default withTracker(() => {
	settings.subscribe('account-holder');
	settings.subscribe('iban');
	settings.subscribe('currency');

	const accountHolder = settings.get('account-holder');
	const iban = settings.get('iban');
	const currency = settings.get('currency');

	return {
		accountHolder,
		iban,
		currency
	};
})(SEPAPaymentDetails);
