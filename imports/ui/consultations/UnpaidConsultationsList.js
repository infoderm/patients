import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React, {Fragment, useState} from 'react' ;

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';

import MoneyIcon from '@material-ui/icons/Money';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import ConsultationCard from './ConsultationCard.js';

import Loading from '../navigation/Loading.js' ;
import NoContent from '../navigation/NoContent.js' ;

import { Consultations } from '../../api/consultations.js';

const useStyles = makeStyles(
  theme => ({
	container: {
		padding: theme.spacing(3),
	},
    thirdPartyToggle: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(3),
    },
    wireToggle: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(12),
    },
    cashToggle: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(21),
    },
  })
);

function UnpaidConsultationsList ( { loading , consultations } ) {

	const classes = useStyles();

	const [showCash, setShowCash] = useState(true) ;
	const [showWire, setShowWire] = useState(true) ;
	const [showThirdParty, setShowThirdParty] = useState(false) ;

	if (loading) return <Loading/>;

	const unpaidConsultations = consultations
		.filter(consultation => consultation.paid !== consultation.price)
		.filter(consultation => showCash || consultation.payment_method !== 'cash')
		.filter(consultation => showWire || consultation.payment_method !== 'wire')
		.filter(consultation => showThirdParty || consultation.payment_method !== 'third-party');

	return (
		<Fragment>
			{ unpaidConsultations.length === 0 ?
			<NoContent>All consultations have been paid for :)</NoContent>
			:
			<div className={classes.container}>
				{
					unpaidConsultations.map(
						consultation => (
							<ConsultationCard
								showPrice
								key={consultation._id}
								consultation={consultation}
							/>
						)
					)
				}
			</div>
			}
			<Fab className={classes.cashToggle} color={showCash ? "primary" : "default"} onClick={() => setShowCash(!showCash)}>
				<MoneyIcon/>
			</Fab>
			<Fab className={classes.wireToggle} color={showWire ? "primary" : "default"} onClick={() => setShowWire(!showWire)}>
				<PaymentIcon/>
			</Fab>
			<Fab className={classes.thirdPartyToggle} color={showThirdParty ? "primary" : "default"} onClick={() => setShowThirdParty(!showThirdParty)}>
				<AccountBalanceWalletIcon/>
			</Fab>
		</Fragment>
	);
}

export default withTracker(() => {
	const handle = Meteor.subscribe('consultations.unpaid');
	if ( !handle.ready() ) return { loading: true } ;
	return {
		loading: false,
		consultations: Consultations.find({
			isDone: true,
		}, {sort: {datetime: 1}}).fetch() ,
	} ;
}) ( UnpaidConsultationsList );
