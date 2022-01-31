import React from 'react';

import {Link} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import MoneyIcon from '@material-ui/icons/Money';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AttachmentIcon from '@material-ui/icons/Attachment';

import dateFormat from 'date-fns/format';

import {useDateFormat} from '../../i18n/datetime';
import {useCurrencyFormat} from '../../i18n/currency';
import {PatientDocument} from '../../api/collection/patients';
import {ConsultationDocument} from '../../api/collection/consultations';
import {msToString, msToStringShort} from '../../api/duration';

const useStyles = makeStyles((theme) => ({
	chips: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap',
		marginRight: -theme.spacing(1),
		marginBottom: -theme.spacing(1),
	},
	chip: {
		marginRight: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	priceChip: {
		backgroundColor: '#228d57',
		color: '#e8e9c9',
	},
	debtChip: {
		backgroundColor: '#f88',
		color: '#fff',
	},
	didNotHappenChip: {
		backgroundColor: '#ff7961',
		color: '#fff',
	},
	boldChip: {
		fontWeight: 'bold',
	},
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

export interface StaticConsultationCardChipsProps {
	isNoShow: boolean;
	patient: PatientDocument;
	consultation: ConsultationDocument;
	PatientChip: React.ElementType;
	showDate: boolean;
	showTime: boolean;
	showPrice: boolean;
	loadingPatient: boolean;
	missingPaymentData: boolean;
	didNotOrWillNotHappen: boolean;
	owes: boolean;
	owed: number;
	attachments: any[];
}

const StaticConsultationCardChips = (
	props: StaticConsultationCardChipsProps,
) => {
	const classes = useStyles();

	const {
		isNoShow,
		didNotOrWillNotHappen,
		missingPaymentData,
		owes,
		owed,
		PatientChip,
		showDate = true,
		showTime = true,
		showPrice = false,
		loadingPatient,
		patient,
		consultation: {
			_id,
			patientId,
			datetime,
			doneDatetime,
			duration,
			isDone,
			isCancelled,
			currency,
			payment_method,
			price,
		},
		attachments,
	} = props;

	const localizedDateFormat = useDateFormat();
	const currencyFormat = useCurrencyFormat(currency);

	return (
		<div className={classes.chips}>
			{showDate && (
				<Chip
					label={localizedDateFormat(datetime, 'PPPP')}
					className={classNames(classes.chip, {
						[classes.didNotHappenChip]: didNotOrWillNotHappen,
					})}
					component={Link}
					to={`/calendar/day/${dateFormat(datetime, 'yyyy-MM-dd')}`}
				/>
			)}
			{showTime && (
				<Chip
					label={localizedDateFormat(datetime, 'p')}
					className={classNames(classes.chip, {
						[classes.didNotHappenChip]: didNotOrWillNotHappen,
					})}
					component={Link}
					to={`/consultation/${_id}`}
				/>
			)}
			{isDone
				? doneDatetime && (
						<Chip
							label={msToStringShort(Number(doneDatetime) - Number(datetime))}
							className={classes.chip}
						/>
				  )
				: duration && (
						<Chip label={msToString(duration)} className={classes.chip} />
				  )}
			{!PatientChip || !patientId ? null : (
				<PatientChip
					loading={loadingPatient}
					found={Boolean(patient)}
					patient={patient || {_id: patientId}}
				/>
			)}
			{isCancelled && (
				<Chip
					label="cancelled"
					className={classNames(classes.chip, {
						[classes.didNotHappenChip]: true,
						[classes.boldChip]: true,
					})}
				/>
			)}
			{isNoShow && (
				<Chip
					label="PVPP"
					className={classNames(classes.chip, {
						[classes.didNotHappenChip]: true,
						[classes.boldChip]: true,
					})}
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
					className={classNames(
						classes.chip,
						classes.boldChip,
						classes.priceChip,
					)}
					avatar={<Avatar>{paymentMethodIcon(payment_method)}</Avatar>}
					label={currencyFormat(price)}
				/>
			)}
			{owes && (
				<Chip
					label={`Doit ${currencyFormat(owed)}`}
					className={classNames(
						classes.chip,
						classes.boldChip,
						classes.debtChip,
					)}
				/>
			)}
		</div>
	);
};

export default StaticConsultationCardChips;
