import React, {useState} from 'react';
import {type useNavigate} from 'react-router-dom';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import {type PatientIdFields} from '../../api/collection/patients';

import EidCardDialogStepSelection from './EidCardDialogStepSelection';
import EidCardDialogStepPreviewSingle from './EidCardDialogStepPreviewSingle';

type Props = {
	navigate: ReturnType<typeof useNavigate>;
	eidInfo: PatientIdFields;
	open: boolean;
	onClose: () => void;
};

const EidCardDialog = ({navigate, eidInfo, open, onClose}: Props) => {
	const [selected, setSelected] = useState(new Set<string>());
	const [step, setStep] = useState('selection');

	const selectionIsSingle = selected.size === 1;

	return (
		<Dialog open={open} onClose={onClose}>
			{step === 'selection' && (
				<EidCardDialogStepSelection
					eidInfo={eidInfo}
					selected={selected}
					setSelected={setSelected}
					onClose={onClose}
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
					onClose={onClose}
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
