import React, {useState} from 'react';

import AssistantIcon from '@mui/icons-material/Assistant';

import PropsOf from '../../util/PropsOf';
import ManageConsultationsForPatientDialog from './ManageConsultationsForPatientDialog';

interface ExtraProps<B> {
	Button: B;
	patientId: string;
	children: React.ReactNode;
}

const ManageConsultationsForPatientButton = <B extends React.ElementType>({
	Button,
	patientId,
	children,
	...rest
}: ExtraProps<B> & PropsOf<B>) => {
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

export default ManageConsultationsForPatientButton;
