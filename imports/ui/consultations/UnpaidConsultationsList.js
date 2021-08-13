import React, {useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';

import MoneyIcon from '@material-ui/icons/Money';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import ReactivePatientChip from '../patients/ReactivePatientChip';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import {computeFixedFabStyle} from '../button/FixedFab';

import useConsultationsUnpaged from './useConsultationsUnpaged';
import ConsultationsList from './ConsultationsList';

const useStyles = makeStyles((theme) => ({
	thirdPartyToggle: computeFixedFabStyle({theme, col: 1}),
	wireToggle: computeFixedFabStyle({theme, col: 2}),
	cashToggle: computeFixedFabStyle({theme, col: 3}),
}));

const UnpaidConsultationsList = () => {
	const classes = useStyles();

	const [showCash, setShowCash] = useState(true);
	const [showWire, setShowWire] = useState(true);
	const [showThirdParty, setShowThirdParty] = useState(false);

	const query = {
		isDone: true,
		unpaid: true,
	};
	const options = {sort: {datetime: 1}};
	const deps = [];
	const {loading, results: unpaidConsultations} = useConsultationsUnpaged(
		query,
		options,
		deps,
	);

	if (loading) {
		return <Loading />;
	}

	const displayedConsultations = unpaidConsultations
		.filter(
			(consultation) => showCash || consultation.payment_method !== 'cash',
		)
		.filter(
			(consultation) => showWire || consultation.payment_method !== 'wire',
		)
		.filter(
			(consultation) =>
				showThirdParty || consultation.payment_method !== 'third-party',
		);

	return (
		<>
			{unpaidConsultations.length === 0 ? (
				<NoContent>All consultations have been paid for :)</NoContent>
			) : displayedConsultations.length === 0 ? (
				<NoContent>
					None of the {unpaidConsultations.length} unpaid consultations matches
					the current filter
				</NoContent>
			) : (
				<ConsultationsList
					items={displayedConsultations}
					itemProps={{
						showPrice: true,
						PatientChip: ReactivePatientChip,
					}}
				/>
			)}
			<Fab
				className={classes.cashToggle}
				color={showCash ? 'primary' : 'default'}
				onClick={() => setShowCash(!showCash)}
			>
				<MoneyIcon />
			</Fab>
			<Fab
				className={classes.wireToggle}
				color={showWire ? 'primary' : 'default'}
				onClick={() => setShowWire(!showWire)}
			>
				<PaymentIcon />
			</Fab>
			<Fab
				className={classes.thirdPartyToggle}
				color={showThirdParty ? 'primary' : 'default'}
				onClick={() => setShowThirdParty(!showThirdParty)}
			>
				<AccountBalanceWalletIcon />
			</Fab>
		</>
	);
};

export default UnpaidConsultationsList;
