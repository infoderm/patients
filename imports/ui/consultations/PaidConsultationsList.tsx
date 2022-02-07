import React from 'react';
import {Link} from 'react-router-dom';

import MoneyIcon from '@material-ui/icons/Money';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import ReactivePatientChip from '../patients/ReactivePatientChip';

import {capitalized} from '../../api/string';
import Center from '../grid/Center';
import YearJumper from '../navigation/YearJumper';
import Filter from '../../api/transaction/Filter';
import {ConsultationDocument} from '../../api/collection/consultations';
import FixedFab from '../button/FixedFab';
import ConsultationsStatsCard from './ConsultationsStatsCard';
import ConsultationsPager from './ConsultationsPager';

interface Props {
	year?: number;
	payment_method?: string;
}

const PaidConsultationsList = ({year, payment_method = undefined}: Props) => {
	const begin = new Date(`${year}-01-01`);
	const end = new Date(`${year + 1}-01-01`);

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
		method
			? (x) => `/paid/year/${x}/payment_method/${method}`
			: (x) => `/paid/year/${x}`;
	const toURL = genericToURL(payment_method);
	const toggle = (method) =>
		payment_method === method
			? genericToURL(undefined)(year)
			: genericToURL(method)(year);
	const title = `${year}`;
	const abbr = title.slice(-2);
	const avatar = payment_method
		? capitalized(payment_method.slice(0, 2))
		: 'Pa';

	return (
		<div>
			<YearJumper current={year} toURL={toURL} />
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
						abbr={abbr}
						avatar={avatar}
					/>
				</Center>
			</div>
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
				component={Link}
				to={toggle('cash')}
				color={payment_method === 'cash' ? 'primary' : 'default'}
			>
				<MoneyIcon />
			</FixedFab>
			<FixedFab
				col={5}
				component={Link}
				to={toggle('wire')}
				color={payment_method === 'wire' ? 'primary' : 'default'}
			>
				<PaymentIcon />
			</FixedFab>
			<FixedFab
				col={4}
				component={Link}
				to={toggle('third-party')}
				color={payment_method === 'third-party' ? 'primary' : 'default'}
			>
				<AccountBalanceWalletIcon />
			</FixedFab>
		</div>
	);
};

export default PaidConsultationsList;
