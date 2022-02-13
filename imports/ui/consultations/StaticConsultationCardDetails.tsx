import React from 'react';
import {styled} from '@mui/material/styles';
import PropTypes from 'prop-types';

import AccordionDetails from '@mui/material/AccordionDetails';

import Typography from '@mui/material/Typography';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

import Avatar from '@mui/material/Avatar';

import ErrorIcon from '@mui/icons-material/Error';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import InfoIcon from '@mui/icons-material/Info';
import DoneIcon from '@mui/icons-material/Done';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import AlarmIcon from '@mui/icons-material/Alarm';
import WarningIcon from '@mui/icons-material/Warning';
import EditIcon from '@mui/icons-material/Edit';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BookIcon from '@mui/icons-material/Book';
import AttachmentIcon from '@mui/icons-material/Attachment';

import {red} from '@mui/material/colors';

import {useDateFormat} from '../../i18n/datetime';
import {useCurrencyFormat} from '../../i18n/currency';
import ReactiveAttachmentLink from '../attachments/ReactiveAttachmentLink';

const PREFIX = 'StaticConsultationCardDetails';

const classes = {
	details: `${PREFIX}-details`,
	veil: `${PREFIX}-veil`,
	link: `${PREFIX}-link`,
	avatarIssues: `${PREFIX}-avatarIssues`,
};

const StyledAccordionDetails = styled(AccordionDetails)(() => ({
	[`&.${classes.details}`]: {
		position: 'relative',
	},

	[`& .${classes.veil}`]: {
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 1,
		fontSize: '2rem',
	},

	[`& .${classes.link}`]: {
		fontWeight: 'bold',
	},

	[`& .${classes.avatarIssues}`]: {
		backgroundColor: red[100],
		color: red[600],
	},
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

const ConsultationsCardListItemBase = ({
	avatar,
	primary,
	secondary,
	...rest
}) => (
	<ListItem>
		<ListItemAvatar>{avatar}</ListItemAvatar>
		<ListItemText
			primary={primary}
			secondary={secondary}
			secondaryTypographyProps={{
				style: {
					whiteSpace: 'pre-wrap',
				},
			}}
			{...rest}
		/>
	</ListItem>
);

const ConsultationsCardListItem = ({Icon, primary, secondary, ...rest}) => (
	<ConsultationsCardListItemBase
		avatar={
			<Avatar>
				<Icon />
			</Avatar>
		}
		primary={primary}
		secondary={secondary}
		{...rest}
	/>
);

const StaticConsultationCardDetails = (props) => {
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
			book,
			inBookNumber,
		},
		attachments,
	} = props;

	const localizedDatetime = useDateFormat('PPPPpppp');
	const currencyFormat = useCurrencyFormat(currency);

	return (
		<StyledAccordionDetails className={classes.details}>
			{deleted && <div className={classes.veil}>DELETED</div>}
			<List>
				{isDone && missingPaymentData && (
					<ConsultationsCardListItemBase
						avatar={
							<Avatar className={classes.avatarIssues}>
								<ErrorIcon />
							</Avatar>
						}
						primary="Problèmes"
						secondary="Il manque des informations de paiement pour cette consultation"
					/>
				)}
				{!isDone && isCancelled && (
					<ConsultationsCardListItem
						Icon={AlarmOffIcon}
						primary="Rendez-vous annulé"
						secondary={`${cancellationReason} ${localizedDatetime(
							cancellationDatetime,
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
						secondary={`À payé ${currencyFormat(paid)} de ${currencyFormat(
							price,
						)}.`}
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
						secondary={inBookNumber ? `${book} - ${inBookNumber}` : book}
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
		</StyledAccordionDetails>
	);
};

StaticConsultationCardDetails.propTypes = {
	consultation: PropTypes.object.isRequired,
};

export default StaticConsultationCardDetails;
