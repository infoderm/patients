import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React, {useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';

import MoneyIcon from '@material-ui/icons/Money';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import StaticConsultationCard from './StaticConsultationCard.js';
import ReactivePatientChip from '../patients/ReactivePatientChip.js';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';
import {computeFixedFabStyle} from '../button/FixedFab.js';

import {Consultations} from '../../api/consultations.js';

const useStyles = makeStyles((theme) => ({
	container: {
		padding: theme.spacing(3)
	},
	thirdPartyToggle: computeFixedFabStyle({theme, col: 1}),
	wireToggle: computeFixedFabStyle({theme, col: 2}),
	cashToggle: computeFixedFabStyle({theme, col: 3})
}));

const UnpaidConsultationsList = ({loading, consultations}) => {
	const classes = useStyles();

	const [showCash, setShowCash] = useState(true);
	const [showWire, setShowWire] = useState(true);
	const [showThirdParty, setShowThirdParty] = useState(false);

	if (loading) {
		return <Loading />;
	}

	const unpaidConsultations = consultations.filter(
		(consultation) => consultation.paid !== consultation.price
	);

	const displayedConsultations = unpaidConsultations
		.filter(
			(consultation) => showCash || consultation.payment_method !== 'cash'
		)
		.filter(
			(consultation) => showWire || consultation.payment_method !== 'wire'
		)
		.filter(
			(consultation) =>
				showThirdParty || consultation.payment_method !== 'third-party'
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
				<div className={classes.container}>
					{displayedConsultations.map((consultation) => (
						<StaticConsultationCard
							key={consultation._id}
							showPrice
							consultation={consultation}
							PatientChip={ReactivePatientChip}
						/>
					))}
				</div>
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

export default withTracker(() => {
	const handle = Meteor.subscribe('consultations.unpaid');
	if (!handle.ready()) {
		return {loading: true};
	}

	return {
		loading: false,
		consultations: Consultations.find(
			{
				isDone: true
			},
			{sort: {datetime: 1}}
		).fetch()
	};
})(UnpaidConsultationsList);
