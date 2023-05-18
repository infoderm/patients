import React, {useState} from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import {styled} from '@mui/material/styles';
import TextField from '../input/TextField';

import {useSetting} from '../settings/hooks';

import CurrencyAmountInput from '../input/CurrencyAmountInput';

import SEPAPaymentQRCode from './SEPAPaymentQRCode';

const size = 500;

const QRCodeWrap = styled(Grid)({
	display: 'table',
	backgroundColor: '#fff',
	padding: '1em',
});

const QRCode = styled(SEPAPaymentQRCode)({
	display: 'table-cell',
	verticalAlign: 'middle',
	textAlign: 'center',
	width: size,
	height: size,
});

const Container = styled(Grid)({
	height: '100%',
});

const StyledPaper = styled(Paper)({
	minWidth: size + 300,
});

const Title = styled(Typography)(({theme}) => ({
	margin: theme.spacing(2),
}));

const TextFieldWrap = styled('div')(({theme}) => ({
	margin: theme.spacing(3),
}));

type Data = {
	name: string;
	iban: string;
	currency: string;
	amount: number;
	unstructuredReference?: string;
};

type SEPAPaymentDetailsStaticProps = {
	accountHolder: string;
	iban: string;
	currency: string;
};

const SEPAPaymentDetailsStatic = ({
	accountHolder,
	iban,
	currency,
}: SEPAPaymentDetailsStaticProps) => {
	const defaultReference = format(startOfToday(), 'yyyy-MM-dd');

	const [amount, setAmount] = useState(0.01);
	const [amountString, setAmountString] = useState(amount.toString());
	const [unstructuredReference, setUnstructuredReference] =
		useState(defaultReference);

	const handleAmountChange = (e) => {
		setAmountString(e.target.value);
		setAmount(Number.parseFloat(e.target.value));
	};

	const data: Data = {
		name: accountHolder,
		iban,
		currency,
		amount: Number.isNaN(amount) ? 0 : amount,
	};

	if (unstructuredReference) {
		data.unstructuredReference = unstructuredReference;
	}

	const codeProps = {
		level: 'H',
		size,
	};

	return (
		<Container container justifyContent="center" alignItems="center">
			<Grid item>
				<StyledPaper>
					<Grid container>
						<Grid item xs>
							<Title variant="h3">SEPA Wire</Title>
							<TextFieldWrap>
								<TextField
									readOnly
									label="Account Holder"
									value={accountHolder}
									InputLabelProps={{shrink: true}}
								/>
							</TextFieldWrap>
							<TextFieldWrap>
								<TextField
									readOnly
									label="IBAN"
									value={iban}
									InputLabelProps={{shrink: true}}
								/>
							</TextFieldWrap>
							<TextFieldWrap>
								<TextField
									readOnly
									label="Currency"
									value={currency}
									InputLabelProps={{shrink: true}}
								/>
							</TextFieldWrap>
							<TextFieldWrap>
								<TextField
									label="Amount"
									value={amountString}
									error={Number.isNaN(amount)}
									InputProps={{
										inputComponent: CurrencyAmountInput as any,
										inputProps: {currency},
									}}
									onChange={handleAmountChange}
								/>
							</TextFieldWrap>
							<TextFieldWrap>
								<TextField
									label="Reference"
									value={unstructuredReference}
									onChange={(e) => {
										setUnstructuredReference(e.target.value);
									}}
								/>
							</TextFieldWrap>
						</Grid>
						<QRCodeWrap item>
							<QRCode data={data} codeProps={codeProps} />
						</QRCodeWrap>
					</Grid>
				</StyledPaper>
			</Grid>
		</Container>
	);
};

const SEPAPaymentDetails = () => {
	const {value: accountHolder} = useSetting('account-holder');
	const {value: iban} = useSetting('iban');
	const {value: currency} = useSetting('currency');

	return (
		<SEPAPaymentDetailsStatic
			accountHolder={accountHolder}
			iban={iban}
			currency={currency}
		/>
	);
};

export default SEPAPaymentDetails;
