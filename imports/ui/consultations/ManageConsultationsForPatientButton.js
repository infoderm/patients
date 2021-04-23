import React, {useState} from 'react';

import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';
import AssistantIcon from '@material-ui/icons/Assistant';

import ManageConsultationsForPatientDialog from './ManageConsultationsForPatientDialog.js';

const ManageConsultationsForPatientButton = ({
	Button,
	patientId,
	children,
	...rest
}) => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button {...rest} onClick={() => setOpen(true)}>
				{children || <AssistantIcon />}
			</Button>
			<ManageConsultationsForPatientDialog
				open={open}
				patientId={patientId}
				onClose={() => setOpen(false)}
			/>
		</>
	);
};

ManageConsultationsForPatientButton.propTypes = {
	Button: PropTypes.elementType,
	patientId: PropTypes.string.isRequired
};

ManageConsultationsForPatientButton.defaultProps = {
	Button
};

export default ManageConsultationsForPatientButton;
