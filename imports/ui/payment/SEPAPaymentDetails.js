import {withTracker} from 'meteor/react-meteor-data';

import React, {useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';

import {settings} from '../../client/settings.js';

import SEPAPaymentQRCode from './SEPAPaymentQRCode.js';

const styles = (theme) => ({
	container: {
		height: '100%'
	},
	paper: {
		width: 800,
		height: 500
	},
	form: {
		padding: theme.spacing(3)
	},
	qrcodeWrap: {
		display: 'table',
		width: 500,
		height: 500
	},
	qrcode: {
		display: 'table-cell',
		verticalAlign: 'middle',
		textAlign: 'center'
	},
	title: {
		margin: theme.spacing(2)
	},
	textField: {
		margin: theme.spacing(3)
	}
});

const useStyles = makeStyles(styles);

const SEPAPaymentDetails = (props) => {
	const classes = useStyles();

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
		size: 500
	};

	return (
		<Grid
			container
			className={classes.container}
			justify="center"
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
								/>
							</div>
							<div className={classes.textField}>
								<TextField readOnly label="IBAN" value={iban} />
							</div>
							<div className={classes.textField}>
								<TextField readOnly label="Currency" value={currency} />
							</div>
							<div className={classes.textField}>
								<TextField
									label="Amount"
									value={amountString}
									error={Number.isNaN(amount)}
									onChange={handleAmountChange}
								/>
							</div>
							<div className={classes.textField}>
								<TextField
									label="Reference"
									value={unstructuredReference}
									onChange={(e) => setUnstructuredReference(e.target.value)}
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
