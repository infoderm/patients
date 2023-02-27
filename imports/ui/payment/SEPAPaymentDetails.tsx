import React, {useState} from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import makeStyles from '../styles/makeStyles';
import TextField from '../input/TextField';

import {useSetting} from '../settings/hooks';

import CurrencyAmountInput from '../input/CurrencyAmountInput';

import SEPAPaymentQRCode from './SEPAPaymentQRCode';

const useStyles = makeStyles()((theme) => ({
	container: {
		height: '100%',
	},
	paper: {
		width: 800,
		height: 500,
	},
	form: {
		padding: theme.spacing(3),
	},
	qrcodeWrap: {
		display: 'table',
		backgroundColor: '#ccc',
		width: 500,
		height: 500,
	},
	qrcode: {
		display: 'table-cell',
		verticalAlign: 'middle',
		textAlign: 'center',
	},
	title: {
		margin: theme.spacing(2),
	},
	textField: {
		margin: theme.spacing(3),
	},
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
	const {classes} = useStyles();

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
		size: 500,
	};

	return (
		<Grid
			container
			className={classes.container}
			justifyContent="center"
			alignItems="center"
		>
			<Grid item>
				<Paper className={classes.paper}>
					<Grid container>
						<Grid item xs>
							<Typography variant="h3" className={classes.title}>
								SEPA Wire
							</Typography>
							<div className={classes.textField}>
								<TextField
									readOnly
									label="Account Holder"
									value={accountHolder}
									InputLabelProps={{shrink: true}}
								/>
							</div>
							<div className={classes.textField}>
								<TextField
									readOnly
									label="IBAN"
									value={iban}
									InputLabelProps={{shrink: true}}
								/>
							</div>
							<div className={classes.textField}>
								<TextField
									readOnly
									label="Currency"
									value={currency}
									InputLabelProps={{shrink: true}}
								/>
							</div>
							<div className={classes.textField}>
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
							</div>
							<div className={classes.textField}>
								<TextField
									label="Reference"
									value={unstructuredReference}
									onChange={(e) => {
										setUnstructuredReference(e.target.value);
									}}
								/>
							</div>
						</Grid>
						<Grid item className={classes.qrcodeWrap}>
							<SEPAPaymentQRCode
								className={classes.qrcode}
								data={data}
								codeProps={codeProps}
							/>
						</Grid>
					</Grid>
				</Paper>
			</Grid>
		</Grid>
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
