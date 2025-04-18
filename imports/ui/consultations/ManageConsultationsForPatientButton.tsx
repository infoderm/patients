import React, {useState} from 'react';

import AssistantIcon from '@mui/icons-material/Assistant';

import type PropsOf from '../../util/types/PropsOf';

import ManageConsultationsForPatientDialog from './ManageConsultationsForPatientDialog';

type ExtraProps<B> = {
	readonly Button: B;
	readonly patientId: string;
	readonly children: React.ReactNode;
};

const ManageConsultationsForPatientButton = React.forwardRef(
	<B extends React.ElementType>(
		{Button, patientId, children, ...rest}: ExtraProps<B> & PropsOf<B>,
		ref,
	) => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button
					ref={ref}
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
	},
);

export default ManageConsultationsForPatientButton;
