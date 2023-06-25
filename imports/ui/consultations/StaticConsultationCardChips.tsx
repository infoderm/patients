import React from 'react';

import {styled} from '@mui/material/styles';

import MuiChip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';

import MoneyIcon from '@mui/icons-material/Money';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachmentIcon from '@mui/icons-material/Attachment';

import dateFormat from 'date-fns/format';

import UnstyledLinkChip from '../chips/LinkChip';

import {useDateFormat} from '../../i18n/datetime';
import {useCurrencyFormat} from '../../i18n/currency';
import {type PatientDocument} from '../../api/collection/patients';
import {type ConsultationDocument} from '../../api/collection/consultations';
import {msToString, msToStringShort} from '../../api/duration';

const Chips = styled('div')(({theme}) => ({
	display: 'flex',
	justifyContent: 'center',
	flexWrap: 'wrap',
	marginRight: theme.spacing(-1),
	marginBottom: theme.spacing(-1),
}));

const additionalProps = new Set<number | string | Symbol>([
	'didNotOrWillNotHappen',
	'isPrice',
	'isDebt',
	'bold',
]);
const shouldForwardProp = (prop) => !additionalProps.has(prop);
const styles: any = ({
	theme,
	didNotOrWillNotHappen,
	isPrice,
	isDebt,
	bold,
}) => ({
	marginRight: theme.spacing(1),
	marginBottom: theme.spacing(1),
	...(isPrice && {
		backgroundColor: '#228d57',
		color: '#e8e9c9',
	}),
	...(isDebt && {
		backgroundColor: theme.palette.error.main,
		color: theme.palette.error.contrastText,
	}),
	...(didNotOrWillNotHappen && {
		backgroundColor: theme.palette.error.light,
		color: theme.palette.error.contrastText,
	}),
	...(bold && {
		fontWeight: 'bold',
	}),
});

type AdditionalChipProps = {
	didNotOrWillNotHappen?: boolean;
	isPrice?: boolean;
	isDebt?: boolean;
	bold?: boolean;
};

const Chip = styled(MuiChip, {shouldForwardProp})<AdditionalChipProps>(styles);
const LinkChip = styled(UnstyledLinkChip, {
	shouldForwardProp,
})<AdditionalChipProps>(styles);

function paymentMethodIcon(payment_method) {
	switch (payment_method) {
		case 'wire': {
			return <PaymentIcon />;
		}

		case 'third-party': {
			return <AccountBalanceWalletIcon />;
		}

		// eslint-disable-next-line unicorn/no-useless-switch-case
		case 'cash':
		default: {
			return <MoneyIcon />;
		}
	}
}

type StaticConsultationCardChipsProps = {
	isNoShow: boolean;
	patient?: {_id: string} | PatientDocument;
	consultation: ConsultationDocument;
	PatientChip?: React.ElementType;
	showDate?: boolean;
	showTime?: boolean;
	showPrice?: boolean;
	loadingPatient?: boolean;
	missingPaymentData: boolean;
	didNotOrWillNotHappen: boolean;
	owes: boolean;
	owed: number;
	attachments: any[];
};

const StaticConsultationCardChips = ({
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
}: StaticConsultationCardChipsProps) => {
	const localizedDateFormat = useDateFormat();
	const currencyFormat = useCurrencyFormat(currency!);

	return (
		<Chips>
			{showDate && (
				<LinkChip
					label={localizedDateFormat(datetime, 'PPPP')}
					didNotOrWillNotHappen={didNotOrWillNotHappen}
					to={`/calendar/day/${dateFormat(datetime, 'yyyy-MM-dd')}`}
				/>
			)}
			{showTime && (
				<LinkChip
					label={localizedDateFormat(datetime, 'p')}
					didNotOrWillNotHappen={didNotOrWillNotHappen}
					to={`/consultation/${_id}`}
				/>
			)}
			{isDone
				? doneDatetime && (
						<Chip
							label={msToStringShort(Number(doneDatetime) - Number(datetime))}
						/>
				  )
				: duration && <Chip label={msToString(duration)} />}
			{!PatientChip || !patientId ? null : (
				<PatientChip
					loading={loadingPatient}
					found={Boolean(patient)}
					patient={patient ?? {_id: patientId}}
				/>
			)}
			{isCancelled && <Chip didNotOrWillNotHappen bold label="cancelled" />}
			{isNoShow && <Chip didNotOrWillNotHappen bold label="PVPP" />}
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
				/>
			)}
			{!missingPaymentData && showPrice && (
				<Chip
					bold
					isPrice
					avatar={<Avatar>{paymentMethodIcon(payment_method)}</Avatar>}
					label={currencyFormat(price!)}
				/>
			)}
			{owes && (
				<Chip
					bold
					isDebt
					avatar={
						<Avatar>
							<MoneyOffIcon />
						</Avatar>
					}
					label={currencyFormat(owed)}
				/>
			)}
		</Chips>
	);
};

export default StaticConsultationCardChips;
