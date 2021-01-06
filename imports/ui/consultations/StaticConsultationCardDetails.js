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

import AttachmentLink from '../attachments/AttachmentLink.js';

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

const StaticConsultationCardDetails = (props) => {
	const classes = useStyles();

	const {
		deleted,
		missingPaymentData,
		consultation: {
			isDone,
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
			attachments
		}
	} = props;

	return (
		<AccordionDetails className={classes.details}>
			{deleted && <div className={classes.veil}>DELETED</div>}
			<List>
				<ListItem>
					<ListItemAvatar>
						<Avatar>
							<InfoIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={
							isDone ? 'Motif de la consultation' : 'Motif du rendez-vous'
						}
						secondary={reason}
					/>
				</ListItem>
				{isDone && (
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<DoneIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Examens déjà réalisés" secondary={done} />
					</ListItem>
				)}
				{isDone && (
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<HourglassFullIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Examens à réaliser" secondary={todo} />
					</ListItem>
				)}
				{isDone && (
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<EditIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Traitement" secondary={treatment} />
					</ListItem>
				)}
				{isDone && (
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<AlarmIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="À revoir" secondary={next} />
					</ListItem>
				)}
				{isDone && (
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<WarningIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Autres remarques" secondary={more} />
					</ListItem>
				)}
				{missingPaymentData ? null : (
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<EuroSymbolIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Paiement"
							secondary={`À payé ${Currency.format(paid, {
								code: currency
							})} de ${Currency.format(price, {code: currency})}.`}
						/>
					</ListItem>
				)}
				{missingPaymentData ? null : (
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<AccountBalanceWalletIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Méthode de Paiement"
							secondary={paymentMethodString(payment_method)}
						/>
					</ListItem>
				)}
				{book && (
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<BookIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Carnet" secondary={book} />
					</ListItem>
				)}
				{attachments === undefined || attachments.length === 0 ? null : (
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<AttachmentIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							disableTypography
							primary={
								<Typography variant="subtitle1">
									{attachments.length} attachments
								</Typography>
							}
							secondary={
								<ul>
									{attachments.map((attachmentId) => (
										<li key={attachmentId}>
											<AttachmentLink
												className={classes.link}
												attachmentId={attachmentId}
											/>
										</li>
									))}
								</ul>
							}
						/>
					</ListItem>
				)}
			</List>
		</AccordionDetails>
	);
};

StaticConsultationCardDetails.propTypes = {
	consultation: PropTypes.object.isRequired
};

export default StaticConsultationCardDetails;
