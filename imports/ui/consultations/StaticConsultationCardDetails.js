import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import AccordionDetails from '@material-ui/core/AccordionDetails';

import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import Avatar from '@material-ui/core/Avatar';

import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';
import InfoIcon from '@material-ui/icons/Info';
import DoneIcon from '@material-ui/icons/Done';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import AlarmIcon from '@material-ui/icons/Alarm';
import WarningIcon from '@material-ui/icons/Warning';
import EditIcon from '@material-ui/icons/Edit';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import BookIcon from '@material-ui/icons/Book';
import AttachmentIcon from '@material-ui/icons/Attachment';

import Currency from 'currency-formatter';

import {useDateFormat} from '../../i18n/datetime';
import ReactiveAttachmentLink from '../attachments/ReactiveAttachmentLink';

const useStyles = makeStyles(() => ({
	details: {
		position: 'relative'
	},
	veil: {
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 1,
		fontSize: '2rem'
	},
	link: {
		fontWeight: 'bold'
	}
}));

function paymentMethodString(payment_method) {
	switch (payment_method) {
		case 'wire':
			return 'Virement';
		case 'third-party':
			return 'Tiers Payant';
		case 'cash':
		default:
			return 'Cash';
	}
}

const ConsultationsCardListItem = ({Icon, primary, secondary, ...rest}) => (
	<ListItem>
		<ListItemAvatar>
			<Avatar>
				<Icon />
			</Avatar>
		</ListItemAvatar>
		<ListItemText
			primary={primary}
			secondary={secondary}
			secondaryTypographyProps={{
				style: {
					whiteSpace: 'pre-wrap'
				}
			}}
			{...rest}
		/>
	</ListItem>
);

const StaticConsultationCardDetails = (props) => {
	const classes = useStyles();

	const {
		deleted,
		missingPaymentData,
		isNoShow,
		consultation: {
			isDone,
			isCancelled,
			cancellationDatetime,
			cancellationReason,
			cancellationExplanation,
			reason,
			done,
			todo,
			treatment,
			next,
			more,
			currency,
			payment_method,
			price,
			paid,
			book
		},
		attachments
	} = props;

	const localizedDatetime = useDateFormat('PPPPpppp');

	return (
		<AccordionDetails className={classes.details}>
			{deleted && <div className={classes.veil}>DELETED</div>}
			<List>
				{!isDone && isCancelled && (
					<ConsultationsCardListItem
						Icon={AlarmOffIcon}
						primary="Rendez-vous annulé"
						secondary={`${cancellationReason} ${localizedDatetime(
							cancellationDatetime
						)}\nExplanation: ${cancellationExplanation || 'unknown'}`}
					/>
				)}
				{isNoShow && (
					<ConsultationsCardListItem
						Icon={PhoneDisabledIcon}
						primary="PVPP"
						secondary="Le patient ne s'est pas présenté et n'a pas annulé."
					/>
				)}
				<ConsultationsCardListItem
					Icon={InfoIcon}
					primary={isDone ? 'Motif de la consultation' : 'Motif du rendez-vous'}
					secondary={reason}
				/>
				{isDone && done && (
					<ConsultationsCardListItem
						Icon={DoneIcon}
						primary="Examens déjà réalisés"
						secondary={done}
					/>
				)}
				{isDone && todo && (
					<ConsultationsCardListItem
						Icon={HourglassFullIcon}
						primary="Examens à réaliser"
						secondary={todo}
					/>
				)}
				{isDone && (
					<ConsultationsCardListItem
						Icon={EditIcon}
						primary="Traitement"
						secondary={treatment}
					/>
				)}
				{isDone && (
					<ConsultationsCardListItem
						Icon={AlarmIcon}
						primary="À revoir"
						secondary={next}
					/>
				)}
				{isDone && more && (
					<ConsultationsCardListItem
						Icon={WarningIcon}
						primary="Autres remarques"
						secondary={more}
					/>
				)}
				{isDone && !missingPaymentData && (
					<ConsultationsCardListItem
						Icon={EuroSymbolIcon}
						primary="Paiement"
						secondary={`À payé ${Currency.format(paid, {
							code: currency
						})} de ${Currency.format(price, {code: currency})}.`}
					/>
				)}
				{isDone && !missingPaymentData && (
					<ConsultationsCardListItem
						Icon={AccountBalanceWalletIcon}
						primary="Méthode de Paiement"
						secondary={paymentMethodString(payment_method)}
					/>
				)}
				{isDone && book && (
					<ConsultationsCardListItem
						Icon={BookIcon}
						primary="Carnet"
						secondary={book}
					/>
				)}
				{attachments === undefined || attachments.length === 0 ? null : (
					<ConsultationsCardListItem
						disableTypography
						Icon={AttachmentIcon}
						primary={
							<Typography variant="subtitle1">
								{attachments.length} attachments
							</Typography>
						}
						secondary={
							<ul>
								{attachments.map(({_id}) => (
									<li key={_id}>
										<ReactiveAttachmentLink
											className={classes.link}
											attachmentId={_id}
										/>
									</li>
								))}
							</ul>
						}
					/>
				)}
			</List>
		</AccordionDetails>
	);
};

StaticConsultationCardDetails.propTypes = {
	consultation: PropTypes.object.isRequired
};

export default StaticConsultationCardDetails;
