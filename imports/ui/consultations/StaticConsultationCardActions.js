import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import AccordionActions from '@material-ui/core/AccordionActions';

import Button from '@material-ui/core/Button';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import SmartphoneIcon from '@material-ui/icons/Smartphone';

import AttachFileButton from '../attachments/AttachFileButton.js';

import ConsultationPaymentDialog from './ConsultationPaymentDialog.js';
import ConsultationDebtSettlementDialog from './ConsultationDebtSettlementDialog.js';
import ConsultationDeletionDialog from './ConsultationDeletionDialog.js';

const StaticConsultationCard = (props) => {
	const [paying, setPaying] = useState(false);
	const [settling, setSettling] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const {
		found,
		owes,
		loadingPatient,
		patient,
		consultation: {_id, payment_method}
	} = props;

	return (
		<AccordionActions>
			<Button
				color="primary"
				component={Link}
				to={`/edit/consultation/${_id}`}
				disabled={!found}
			>
				Edit
				<EditIcon />
			</Button>
			{owes && payment_method === 'wire' && (
				<Button
					color="primary"
					disabled={!found}
					onClick={() => setPaying(true)}
				>
					Pay by Phone
					<SmartphoneIcon />
				</Button>
			)}
			{owes && (
				<Button
					color="primary"
					disabled={!found}
					onClick={() => setSettling(true)}
				>
					Settle debt
					<EuroSymbolIcon />
				</Button>
			)}
			<AttachFileButton
				color="primary"
				method="consultations.attach"
				item={_id}
				disabled={!found}
			/>
			<Button
				color="secondary"
				disabled={!found}
				onClick={() => setDeleting(true)}
			>
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
					disabled={!found}
					onClose={() => setPaying(false)}
				/>
			)}
			{!owes || loadingPatient || !patient ? null : (
				<ConsultationDebtSettlementDialog
					open={settling}
					consultation={props.consultation}
					patient={patient}
					disabled={!found}
					onClose={() => setSettling(false)}
				/>
			)}
			{loadingPatient || !patient ? null : (
				<ConsultationDeletionDialog
					open={deleting}
					consultation={props.consultation}
					patient={patient}
					disabled={!found}
					onClose={() => setDeleting(false)}
				/>
			)}
		</AccordionActions>
	);
};

StaticConsultationCard.defaultProps = {
	found: true
};

StaticConsultationCard.propTypes = {
	found: PropTypes.bool,
	consultation: PropTypes.object.isRequired
};

export default StaticConsultationCard;
