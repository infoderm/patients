import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';

import MoneyIcon from '@material-ui/icons/Money';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import dateFormat from 'date-fns/format';

import ReactivePatientChip from '../patients/ReactivePatientChip.js';
import ConsultationsPager from './ConsultationsPager.js';
import ConsultationsStatsCard from './ConsultationsStatsCard.js';

import {capitalized} from '../../api/string.js';
import Center from '../grid/Center.js';
import {computeFixedFabStyle} from '../button/FixedFab.js';
import YearJumper from '../navigation/YearJumper.js';

const useStyles = makeStyles((theme) => ({
	thirdPartyToggle: computeFixedFabStyle({theme, col: 4}),
	wireToggle: computeFixedFabStyle({theme, col: 5}),
	cashToggle: computeFixedFabStyle({theme, col: 6})
}));

export default function PaidConsultationsList({
	match,
	payment_method,
	year,
	page,
	perpage
}) {
	const now = new Date();
	payment_method = (match && match.params.payment_method) || payment_method;
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page;
	year = (match && match.params.year) || year || dateFormat(now, 'yyyy');

	const current = Number.parseInt(year, 10);

	const begin = new Date(`${current}-01-01`);
	const end = new Date(`${current + 1}-01-01`);

	const query = {
		isDone: true,
		datetime: {
			$gte: begin,
			$lt: end
		}
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
	const url = toURL(year);
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
					paddingTop: 20
				}}
			>
				<Center>
					<ConsultationsStatsCard
						query={query}
						title={title}
						url={url}
						abbr={abbr}
						avatar={avatar}
					/>
				</Center>
			</div>
			<ConsultationsPager
				root={url}
				url={match.url}
				page={page}
				perpage={perpage}
				query={query}
				sort={sort}
				itemProps={{
					showPrice: true,
					PatientChip: ReactivePatientChip
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
}

PaidConsultationsList.defaultProps = {
	page: 1,
	perpage: 10
};

PaidConsultationsList.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number
};
