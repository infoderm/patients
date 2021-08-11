import React, {useState} from 'react';

import Button from '@material-ui/core/Button';

import PropTypes, {InferProps} from 'prop-types';
import AssistantIcon from '@material-ui/icons/Assistant';

import PropsOf from '../../util/PropsOf';
import ManageConsultationsForPatientDialog from './ManageConsultationsForPatientDialog';

const ManageConsultationsForPatientButton = ({
	Button,
	patientId,
	children,
	...rest
}: InferProps<typeof ManageConsultationsForPatientButton.propTypes> &
	PropsOf<typeof Button>) => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button
				{...rest}
				onClick={() => {
					setOpen(true);
				}}
			>
				{children ?? <AssistantIcon />}
			</Button>
			<ManageConsultationsForPatientDialog
				open={open}
				patientId={patientId}
				onClose={() => {
					setOpen(false);
				}}
			/>
		</>
	);
};

ManageConsultationsForPatientButton.propTypes = {
	Button: PropTypes.elementType,
	patientId: PropTypes.string.isRequired,
	children: PropTypes.node,
};

ManageConsultationsForPatientButton.defaultProps = {
	Button,
};

export default ManageConsultationsForPatientButton;
