import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import {PatientIdFields} from '../../api/collection/patients';

import useUniqueId from '../hooks/useUniqueId';
import EidCardDialogStepSelection from './EidCardDialogStepSelection';
import EidCardDialogStepPreviewSingle from './EidCardDialogStepPreviewSingle';

interface Props {
	navigate: ReturnType<typeof useNavigate>;
	eidInfo: PatientIdFields;
	open: boolean;
	onClose: () => void;
}

const EidCardDialog = ({navigate, eidInfo, open, onClose}: Props) => {
	const [selected, setSelected] = useState(new Set());
	const [step, setStep] = useState('selection');

	const selectionIsSingle = selected.size === 1;

	const titleId = useUniqueId('eid-card-dialog-title');

	return (
		<Dialog aria-labelledby={titleId} open={open} onClose={onClose}>
			{step === 'selection' && (
				<EidCardDialogStepSelection
					titleId={titleId}
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
					titleId={titleId}
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
					<DialogTitle id={titleId}>Error</DialogTitle>
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
