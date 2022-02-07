import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import MoneyIcon from '@material-ui/icons/Money';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import FixedFab from '../button/FixedFab';

import ReactivePatientChip from '../patients/ReactivePatientChip';

import YearJumper from '../navigation/YearJumper';
import Filter from '../../api/transaction/Filter';
import {ConsultationDocument} from '../../api/collection/consultations';
import ConsultationsPager from './ConsultationsPager';

interface Props {
	year: number;
}

const UnpaidConsultationsList = ({year}: Props) => {
	const begin = new Date(`${year}-01-01`);
	const end = new Date(`${year + 1}-01-01`);

	const navigate = useNavigate();

	const [showCash, setShowCash] = useState(true);
	const [showWire, setShowWire] = useState(true);
	const [showThirdParty, setShowThirdParty] = useState(false);

	const displayedPaymentMethods = [];
	if (showCash) displayedPaymentMethods.push('cash');
	if (showWire) displayedPaymentMethods.push('wire');
	if (showThirdParty) displayedPaymentMethods.push('third-party');

	const query: Filter<ConsultationDocument> = {
		isDone: true,
		unpaid: true,
		datetime: {
			$gte: begin,
			$lt: end,
		},
	};

	if (displayedPaymentMethods.length > 0) {
		query.payment_method = {$in: displayedPaymentMethods};
	}

	const sort = {datetime: 1};

	const toURL = (x) => `/unpaid/year/${x}`;

	return (
		<div>
			<YearJumper current={year} toURL={toURL} />
			<ConsultationsPager
				query={query}
				sort={sort}
				itemProps={{
					showPrice: true,
					PatientChip: ReactivePatientChip,
				}}
			/>
			<FixedFab
				col={6}
				color={showCash ? 'primary' : 'default'}
				onClick={() => {
					navigate(toURL(year));
					setShowCash(!showCash);
				}}
			>
				<MoneyIcon />
			</FixedFab>
			<FixedFab
				col={5}
				color={showWire ? 'primary' : 'default'}
				onClick={() => {
					navigate(toURL(year));
					setShowWire(!showWire);
				}}
			>
				<PaymentIcon />
			</FixedFab>
			<FixedFab
				col={4}
				color={showThirdParty ? 'primary' : 'default'}
				onClick={() => {
					navigate(toURL(year));
					setShowThirdParty(!showThirdParty);
				}}
			>
				<AccountBalanceWalletIcon />
			</FixedFab>
		</div>
	);
};

export default UnpaidConsultationsList;
