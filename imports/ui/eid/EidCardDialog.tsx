import React, {useState} from 'react';
import {History} from 'history';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import {PatientIdFields} from '../../api/collection/patients';

import EidCardDialogStepSelection from './EidCardDialogStepSelection';
import EidCardDialogStepPreviewSingle from './EidCardDialogStepPreviewSingle';

interface Props {
	history: History;
	eidInfo: PatientIdFields;
	open: boolean;
	onClose: () => void;
}

const EidCardDialog = ({history, eidInfo, open, onClose}: Props) => {
	const [selected, setSelected] = useState(new Set());
	const [step, setStep] = useState('selection');

	const selectionIsSingle = selected.size === 1;

	return (
		<Dialog aria-labelledby="simple-dialog-title" open={open} onClose={onClose}>
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
					history={history}
					patientId={selected[Symbol.iterator]().next().value}
					onPrevStep={() => {
						setStep('selection');
					}}
					onClose={onClose}
				/>
			)}
			{step === 'preview' && !selectionIsSingle && (
				<DialogContent>
					<DialogContentText>
						Cannot handle 0-selection or multi-selection at the moment.
					</DialogContentText>
				</DialogContent>
			)}
		</Dialog>
	);
};

export default EidCardDialog;
