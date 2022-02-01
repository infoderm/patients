import React from 'react';
import {Link, useLocation, useParams} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';

import MoneyIcon from '@material-ui/icons/Money';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import dateFormat from 'date-fns/format';

import ReactivePatientChip from '../patients/ReactivePatientChip';

import {capitalized} from '../../api/string';
import Center from '../grid/Center';
import {computeFixedFabStyle} from '../button/FixedFab';
import YearJumper from '../navigation/YearJumper';
import Filter from '../../api/transaction/Filter';
import {ConsultationDocument} from '../../api/collection/consultations';
import ConsultationsStatsCard from './ConsultationsStatsCard';
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

const PaidConsultationsList = ({
	defaultPage = 1,
	defaultPerpage = 10,
}: Props) => {
	const now = new Date();
	const params = useParams<Params>();
	const location = useLocation();
	const payment_method = params.payment_method;
	const page = Number.parseInt(params.page, 10) || defaultPage;
	const perpage = defaultPerpage;
	const year = params.year || dateFormat(now, 'yyyy');

	const current = Number.parseInt(year, 10);

	const begin = new Date(`${current}-01-01`);
	const end = new Date(`${current + 1}-01-01`);

	const query: Filter<ConsultationDocument> = {
		isDone: true,
		datetime: {
			$gte: begin,
			$lt: end,
		},
	};

	if (payment_method) query.payment_method = payment_method;

	const sort = {datetime: -1};

	const genericToURL = (method) =>
		method ? (x) => `/paid/${method}/${x}` : (x) => `/paid/${x}`;
	const toURL = genericToURL(payment_method);
	const toggle = (method) =>
		payment_method === method
			? genericToURL(undefined)(`${year}/page/${page}`)
			: genericToURL(method)(`${year}/page/${page}`);
	const root = toURL(year);
	const title = year;
	const abbr = year.slice(-2);
	const avatar = payment_method
		? capitalized(payment_method.slice(0, 2))
		: 'Pa';

	const classes = useStyles();

	return (
		<div>
			<YearJumper current={current} toURL={toURL} />
			<div
				style={{
					paddingLeft: 30,
					paddingRight: 30,
					paddingBottom: 50,
					paddingTop: 20,
				}}
			>
				<Center>
					<ConsultationsStatsCard
						query={query}
						title={title}
						url={root}
						abbr={abbr}
						avatar={avatar}
					/>
				</Center>
			</div>
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
				component={Link}
				to={toggle('cash')}
				color={payment_method === 'cash' ? 'primary' : 'default'}
			>
				<MoneyIcon />
			</Fab>
			<Fab
				className={classes.wireToggle}
				component={Link}
				to={toggle('wire')}
				color={payment_method === 'wire' ? 'primary' : 'default'}
			>
				<PaymentIcon />
			</Fab>
			<Fab
				className={classes.thirdPartyToggle}
				component={Link}
				to={toggle('third-party')}
				color={payment_method === 'third-party' ? 'primary' : 'default'}
			>
				<AccountBalanceWalletIcon />
			</Fab>
		</div>
	);
};

export default PaidConsultationsList;
