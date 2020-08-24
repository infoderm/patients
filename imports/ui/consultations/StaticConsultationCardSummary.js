import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';

import AccordionSummary from '@material-ui/core/AccordionSummary';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoneyIcon from '@material-ui/icons/Money';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AttachmentIcon from '@material-ui/icons/Attachment';

import dateFormat from 'date-fns/format';

import Currency from 'currency-formatter';

import StaticPatientChip from '../patients/StaticPatientChip.js';

const useStyles = makeStyles((theme) => ({
	summary: {
		position: 'relative'
	},
	chips: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap'
	},
	chip: {
		marginRight: theme.spacing(1)
	},
	patientchip: {
		backgroundColor: '#88f',
		fontWeight: 'bold'
	},
	pricechip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#228d57',
		color: '#e8e9c9',
		fontWeight: 'bold'
	},
	debtchip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#f88',
		color: '#fff',
		fontWeight: 'bold'
	}
}));

function paymentMethodIcon(payment_method) {
	switch (payment_method) {
		case 'wire':
			return <PaymentIcon />;
		case 'third-party':
			return <AccountBalanceWalletIcon />;
		case 'cash':
		default:
			return <MoneyIcon />;
	}
}

const StaticConsultationCard = (props) => {
	const classes = useStyles();

	const {
		missingPaymentData,
		owes,
		owed,
		patientChip,
		showPrice,
		loadingPatient,
		patient,
		consultation: {
			patientId,
			datetime,
			currency,
			payment_method,
			price,
			attachments
		}
	} = props;

	return (
		<AccordionSummary
			className={classes.summary}
			expandIcon={<ExpandMoreIcon />}
		>
			<div className={classes.chips}>
				<Chip
					label={dateFormat(datetime, 'iii do MMMM yyyy')}
					className={classes.chip}
					component={Link}
					to={`/calendar/${dateFormat(datetime, 'yyyy-MM-dd')}`}
				/>
				<Chip label={dateFormat(datetime, 'hh:mma')} className={classes.chip} />
				{!patientChip || !patientId ? null : (
					<StaticPatientChip
						className={classes.patientchip}
						loading={loadingPatient}
						exists={Boolean(patient)}
						patient={patient || {_id: patientId}}
					/>
				)}
				{attachments === undefined || attachments.length === 0 ? (
					''
				) : (
					<Chip
						avatar={
							<Avatar>
								<AttachmentIcon />
							</Avatar>
						}
						label={attachments.length}
						className={classes.chip}
					/>
				)}
				{!missingPaymentData && showPrice && (
					<Chip
						className={classes.pricechip}
						avatar={<Avatar>{paymentMethodIcon(payment_method)}</Avatar>}
						label={Currency.format(price, {code: currency})}
					/>
				)}
				{owes && (
					<Chip
						label={`Doit ${Currency.format(owed, {code: currency})}`}
						className={classes.debtchip}
					/>
				)}
			</div>
		</AccordionSummary>
	);
};

StaticConsultationCard.defaultProps = {
	patientChip: true,
	showPrice: false
};

StaticConsultationCard.propTypes = {
	consultation: PropTypes.object.isRequired,
	patientChip: PropTypes.bool,
	showPrice: PropTypes.bool
};

export default StaticConsultationCard;
