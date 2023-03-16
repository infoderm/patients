import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import MoneyIcon from '@mui/icons-material/Money';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import ReactivePatientChip from '../patients/ReactivePatientChip';

import {capitalized} from '../../api/string';
import Center from '../grid/Center';
import YearJumper from '../navigation/YearJumper';
import type Filter from '../../api/QueryFilter';
import {type ConsultationDocument} from '../../api/collection/consultations';
import FixedFab from '../button/FixedFab';
import ConsultationsStatsCard from './ConsultationsStatsCard';
import ConsultationsPager from './ConsultationsPager';

type Props = {
	year: number;
	payment_method?: string;
};

const PaidConsultationsList = ({year, payment_method = undefined}: Props) => {
	const [showBookZero, setShowBookZero] = useState(false);
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
	if (!showBookZero) query.book = {$ne: '0'};

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
				col={7}
				color={showBookZero ? 'primary' : 'default'}
				onClick={() => {
					setShowBookZero(!showBookZero);
				}}
			>
				0
			</FixedFab>
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
