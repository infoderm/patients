import React, {useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';

import MoneyIcon from '@material-ui/icons/Money';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import dateFormat from 'date-fns/format';

import ReactivePatientChip from '../patients/ReactivePatientChip';

import {computeFixedFabStyle} from '../button/FixedFab';
import YearJumper from '../navigation/YearJumper';
import Filter from '../../api/transaction/Filter';
import {ConsultationDocument} from '../../api/collection/consultations';
import ConsultationsPager from './ConsultationsPager';

const useStyles = makeStyles((theme) => ({
	thirdPartyToggle: computeFixedFabStyle({theme, col: 4}),
	wireToggle: computeFixedFabStyle({theme, col: 5}),
	cashToggle: computeFixedFabStyle({theme, col: 6}),
}));

interface Params {
	payment_method?: string;
	page?: string;
	year?: string;
}

interface Props {
	defaultPage?: number;
	defaultPerpage?: number;
}

const UnpaidConsultationsList = ({
	defaultPage = 1,
	defaultPerpage = 10,
}: Props) => {
	const now = new Date();
	const params = useParams<Params>();
	const location = useLocation();
	const page = Number.parseInt(params.page, 10) || defaultPage;
	const perpage = defaultPerpage;
	const year = params.year || dateFormat(now, 'yyyy');

	const current = Number.parseInt(year, 10);

	const begin = new Date(`${current}-01-01`);
	const end = new Date(`${current + 1}-01-01`);

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

	const toURL = (x) => `/unpaid/${x}`;
	const root = toURL(year);

	const classes = useStyles();

	return (
		<div>
			<YearJumper current={current} toURL={toURL} />
			<ConsultationsPager
				root={root}
				url={location.pathname}
				page={page}
				perpage={perpage}
				query={query}
				sort={sort}
				itemProps={{
					showPrice: true,
					PatientChip: ReactivePatientChip,
				}}
			/>
			<Fab
				className={classes.cashToggle}
				color={showCash ? 'primary' : 'default'}
				onClick={() => {
					setShowCash(!showCash);
				}}
			>
				<MoneyIcon />
			</Fab>
			<Fab
				className={classes.wireToggle}
				color={showWire ? 'primary' : 'default'}
				onClick={() => {
					setShowWire(!showWire);
				}}
			>
				<PaymentIcon />
			</Fab>
			<Fab
				className={classes.thirdPartyToggle}
				color={showThirdParty ? 'primary' : 'default'}
				onClick={() => {
					setShowThirdParty(!showThirdParty);
				}}
			>
				<AccountBalanceWalletIcon />
			</Fab>
		</div>
	);
};

export default UnpaidConsultationsList;
