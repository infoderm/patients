import React, {useState} from 'react';
import {type useNavigate} from 'react-router-dom';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import {type EidFields} from '../../api/collection/eids';

import EidCardDialogStepSelection from './EidCardDialogStepSelection';
import EidCardDialogStepPreviewSingle from './EidCardDialogStepPreviewSingle';

type Props = {
	readonly navigate: ReturnType<typeof useNavigate>;
	readonly eidInfo: EidFields;
	readonly open: boolean;
	readonly onConfirm: () => void;
	readonly onCancel: () => void;
};

const EidCardDialog = ({
	navigate,
	eidInfo,
	open,
	onConfirm,
	onCancel,
}: Props) => {
	const [selected, setSelected] = useState(new Set<string>());
	const [step, setStep] = useState('selection');

	const selectionIsSingle = selected.size === 1;

	return (
		<Dialog open={open} onClose={onCancel}>
			{step === 'selection' && (
				<EidCardDialogStepSelection
					eidInfo={eidInfo}
					selected={selected}
					setSelected={setSelected}
					onClose={onCancel}
					onNext={() => {
						setStep('preview');
					}}
				/>
			)}
			{step === 'preview' && selectionIsSingle && (
				<EidCardDialogStepPreviewSingle
					eidInfo={eidInfo}
					navigate={navigate}
					patientId={selected[Symbol.iterator]().next().value}
					onPrevStep={() => {
						setStep('selection');
					}}
					onConfirm={onConfirm}
				/>
			)}
			{step === 'preview' && !selectionIsSingle && (
				<>
					<DialogTitle>Error</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Cannot handle 0-selection or multi-selection at the moment.
						</DialogContentText>
					</DialogContent>
				</>
			)}
		</Dialog>
	);
};

export default EidCardDialog;
