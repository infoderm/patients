import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';
import DoneIcon from '@material-ui/icons/Done';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import AlarmIcon from '@material-ui/icons/Alarm';
import WarningIcon from '@material-ui/icons/Warning';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import MoneyIcon from '@material-ui/icons/Money';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import BookIcon from '@material-ui/icons/Book';
import AttachmentIcon from '@material-ui/icons/Attachment';
import SmartphoneIcon from '@material-ui/icons/Smartphone';

import dateFormat from 'date-fns/format';

import Currency from 'currency-formatter';

import AttachFileButton from '../attachments/AttachFileButton.js';
import AttachmentLink from '../attachments/AttachmentLink.js';

import StaticPatientChip from '../patients/StaticPatientChip.js';

import ConsultationPaymentDialog from './ConsultationPaymentDialog.js';
import ConsultationDebtSettlementDialog from './ConsultationDebtSettlementDialog.js';
import ConsultationDeletionDialog from './ConsultationDeletionDialog.js';

const useStyles = makeStyles((theme) => ({
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular
	},
	chips: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap'
	},
	chip: {
		marginRight: theme.spacing(1)
	},
	linksep: {
		marginRight: theme.spacing(1)
	},
	link: {
		fontWeight: 'bold'
	},
	patientchip: {
		backgroundColor: '#88f',
		fontWeight: 'bold'
	},
	pricechip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#228d57',
		color: '#e8e9c9',
		fontWeight: 'bold'
	},
	debtchip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#f88',
		color: '#fff',
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

function paymentMethodIcon(payment_method) {
	switch (payment_method) {
		case 'wire':
			return <PaymentIcon />;
		case 'third-party':
			return <AccountBalanceWalletIcon />;
		case 'cash':
		default:
			return <MoneyIcon />;
	}
}

const StaticConsultationCard = (props) => {
	const classes = useStyles();

	const [paying, setPaying] = useState(false);
	const [settling, setSettling] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const {
		patientChip,
		showPrice,
		defaultExpanded,
		loadingPatient,
		patient,
		consultation: {
			_id,
			patientId,
			datetime,
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

	const missingPaymentData =
		currency === undefined || price === undefined || paid === undefined;
	const owes = !(missingPaymentData || paid === price);
	const owed = owes ? price - paid : 0;

	return (
		<Accordion defaultExpanded={defaultExpanded}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<div className={classes.chips}>
					<Chip
						label={dateFormat(datetime, 'iii do MMMM yyyy')}
						className={classes.chip}
						component={Link}
						to={`/calendar/${dateFormat(datetime, 'yyyy-MM-dd')}`}
					/>
					<Chip
						label={dateFormat(datetime, 'hh:mma')}
						className={classes.chip}
					/>
					{!patientChip || !patientId ? null : (
						<StaticPatientChip
							className={classes.patientchip}
							loading={loadingPatient}
							exists={Boolean(patient)}
							patient={patient || {_id: patientId}}
						/>
					)}
					{attachments === undefined || attachments.length === 0 ? (
						''
					) : (
						<Chip
							avatar={
								<Avatar>
									<AttachmentIcon />
								</Avatar>
							}
							label={attachments.length}
							className={classes.chip}
						/>
					)}
					{!missingPaymentData && showPrice && (
						<Chip
							className={classes.pricechip}
							avatar={<Avatar>{paymentMethodIcon(payment_method)}</Avatar>}
							label={Currency.format(price, {code: currency})}
						/>
					)}
					{owes && (
						<Chip
							label={`Doit ${Currency.format(owed, {code: currency})}`}
							className={classes.debtchip}
						/>
					)}
				</div>
			</AccordionSummary>
			<AccordionDetails>
				<List>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<InfoIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Motif de la consultation"
							secondary={reason}
						/>
					</ListItem>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<DoneIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Examens déjà réalisés" secondary={done} />
					</ListItem>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<HourglassFullIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Examens à réaliser" secondary={todo} />
					</ListItem>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<EditIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Traitement" secondary={treatment} />
					</ListItem>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<AlarmIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="À revoir" secondary={next} />
					</ListItem>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<WarningIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Autres remarques" secondary={more} />
					</ListItem>
					{missingPaymentData ? (
						''
					) : (
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
					{missingPaymentData ? (
						''
					) : (
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
					{book === '' ? (
						''
					) : (
						<ListItem>
							<ListItemAvatar>
								<Avatar>
									<BookIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Carnet" secondary={book} />
						</ListItem>
					)}
					{attachments === undefined || attachments.length === 0 ? (
						''
					) : (
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
			<Divider />
			<AccordionActions>
				<Button
					color="primary"
					component={Link}
					to={`/edit/consultation/${_id}`}
				>
					Edit
					<EditIcon />
				</Button>
				{owes && payment_method === 'wire' && (
					<Button color="primary" onClick={() => setPaying(true)}>
						Pay by Phone
						<SmartphoneIcon />
					</Button>
				)}
				{owes && (
					<Button color="primary" onClick={() => setSettling(true)}>
						Settle debt
						<EuroSymbolIcon />
					</Button>
				)}
				<AttachFileButton
					color="primary"
					method="consultations.attach"
					item={_id}
				/>
				<Button color="secondary" onClick={() => setDeleting(true)}>
					Delete
					<DeleteIcon />
				</Button>
				{!owes ||
				payment_method !== 'wire' ||
				loadingPatient ||
				!patient ? null : (
					<ConsultationPaymentDialog
						open={paying}
						consultation={props.consultation}
						patient={patient}
						onClose={() => setPaying(false)}
					/>
				)}
				{!owes || loadingPatient || !patient ? null : (
					<ConsultationDebtSettlementDialog
						open={settling}
						consultation={props.consultation}
						patient={patient}
						onClose={() => setSettling(false)}
					/>
				)}
				{loadingPatient || !patient ? null : (
					<ConsultationDeletionDialog
						open={deleting}
						consultation={props.consultation}
						patient={patient}
						onClose={() => setDeleting(false)}
					/>
				)}
			</AccordionActions>
		</Accordion>
	);
};

StaticConsultationCard.defaultProps = {
	patientChip: true,
	showPrice: false,
	defaultExpanded: false
};

StaticConsultationCard.propTypes = {
	consultation: PropTypes.object.isRequired,
	patientChip: PropTypes.bool,
	showPrice: PropTypes.bool,
	defaultExpanded: PropTypes.bool
};

export default StaticConsultationCard;
