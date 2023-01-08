import React, {type Dispatch, type ReducerAction, useState} from 'react';

import {useSnackbar} from 'notistack';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FixedFab from '../button/FixedFab';

import call from '../../api/endpoint/call';
import patientsUpdate from '../../api/endpoint/patients/update';
import patientsAttach from '../../api/endpoint/patients/attach';

import {type PatientDocument} from '../../api/collection/patients';

import ManageConsultationsForPatientButton from '../consultations/ManageConsultationsForPatientButton';
import AttachFileButton from '../attachments/AttachFileButton';

import debounceSnackbar from '../../util/debounceSnackbar';

import {documentDiff} from '../../api/update';
import {type reducer} from './usePatientPersonalInformationReducer';

type PatientPersonalInformationButtonsStaticProps = {
	dirty: boolean;
	editing: boolean;
	dispatch: Dispatch<ReducerAction<typeof reducer>>;
	patient: PatientDocument;
	patientInit: PatientDocument;
};

const PatientPersonalInformationButtonsStatic = ({
	dispatch,
	dirty,
	editing,
	patient,
	patientInit,
}: PatientPersonalInformationButtonsStaticProps) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [saving, setSaving] = useState(false);

	const saveDetails = async (_event) => {
		const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
		feedback('Processing...', {
			variant: 'info',
			persist: true,
		});
		setSaving(true);

		try {
			await call(
				patientsUpdate,
				patient._id,
				documentDiff(patientInit, patient),
			);
			setSaving(false);
			const message = `Patient #${patient._id} updated.`;
			console.log(message);
			feedback(message, {variant: 'success'});
			dispatch({type: 'not-editing'});
		} catch (error: unknown) {
			setSaving(false);
			const message = error instanceof Error ? error.message : 'unknown error';
			feedback(message, {variant: 'error'});
			console.error({error});
		}
	};

	return (
		<>
			<FixedFab
				visible={editing}
				col={2}
				color="primary"
				disabled={!dirty}
				pending={saving}
				aria-label="Save"
				onClick={saveDetails}
			>
				<SaveIcon />
			</FixedFab>
			<FixedFab
				visible={editing}
				col={3}
				color={dirty ? 'secondary' : 'default'}
				disabled={saving}
				aria-label="Undo"
				onClick={() => {
					dispatch({type: 'init', payload: patientInit});
				}}
			>
				<UndoIcon />
			</FixedFab>
			<FixedFab
				visible={!editing}
				col={2}
				tooltip="Edit info"
				onClick={() => {
					dispatch({type: 'editing'});
				}}
			>
				<EditIcon />
			</FixedFab>
			<AttachFileButton
				Button={FixedFab}
				visible={!editing}
				col={3}
				endpoint={patientsAttach}
				item={patient._id}
			>
				<AttachFileIcon />
			</AttachFileButton>
			<ManageConsultationsForPatientButton
				Button={FixedFab}
				visible={!editing}
				col={4}
				color="primary"
				patientId={patient._id}
				tooltip="More actions!"
			/>
			<FixedFab
				visible={!editing}
				col={5}
				color="secondary"
				onClick={() => {
					dispatch({type: 'deleting'});
				}}
			>
				<DeleteIcon />
			</FixedFab>
		</>
	);
};

export default PatientPersonalInformationButtonsStatic;
