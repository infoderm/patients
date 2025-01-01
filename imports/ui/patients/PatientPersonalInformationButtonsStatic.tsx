import React, {type Dispatch, type ReducerAction, useState} from 'react';

import {useSnackbar} from 'notistack';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import MergeType from '@mui/icons-material/MergeType';

import FixedFab from '../button/FixedFab';

import call from '../../api/endpoint/call';
import patientsUpdate from '../../api/endpoint/patients/update';
import patientsAttach from '../../api/endpoint/patients/attach';

import {
	type PatientUpdate,
	type PatientDocument,
} from '../../api/collection/patients';

import ManageConsultationsForPatientButton from '../consultations/ManageConsultationsForPatientButton';
import AttachFileButton from '../attachments/AttachFileButton';

import debounceSnackbar from '../snackbar/debounceSnackbar';

import {documentDiff} from '../../api/update';

import {type reducer} from './usePatientPersonalInformationReducer';

type PatientPersonalInformationButtonsStaticProps = {
	readonly readOnly: boolean;
	readonly loading: boolean;
	readonly dirty: boolean;
	readonly editing: boolean;
	readonly dispatch: Dispatch<ReducerAction<typeof reducer>>;
	readonly patient: Omit<PatientDocument, 'deathdate'> & {
		deathdate?: Date | null;
	};
	readonly patientInit?: Omit<PatientDocument, 'deathdate'> & {
		deathdate?: Date | null;
	};
	readonly initChanged?: boolean;
	readonly refresh: () => void;
};

const PatientPersonalInformationButtonsStatic = ({
	dispatch,
	loading,
	dirty,
	editing,
	readOnly,
	patient,
	patientInit,
	initChanged,
	refresh,
}: PatientPersonalInformationButtonsStaticProps) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [saving, setSaving] = useState(false);

	const saveDetails =
		patientInit === undefined
			? undefined
			: async () => {
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
							documentDiff(patientInit, patient) as PatientUpdate,
						);
						setSaving(false);
						const message = `Patient #${patient._id} updated.`;
						console.log(message);
						feedback(message, {variant: 'success'});
						dispatch({type: 'not-editing'});
					} catch (error: unknown) {
						setSaving(false);
						const message =
							error instanceof Error ? error.message : 'unknown error';
						feedback(message, {variant: 'error'});
						console.error({error});
					}
			  };

	return (
		<>
			<FixedFab
				visible={!readOnly && initChanged}
				col={1}
				color={dirty ? 'secondary' : 'default'}
				disabled={loading || saving}
				aria-label="Merge"
				onClick={refresh}
			>
				<MergeType />
			</FixedFab>
			<FixedFab
				visible={!readOnly}
				col={2}
				color={initChanged ? 'secondary' : 'default'}
				disabled={loading || !dirty || patientInit === undefined}
				pending={saving}
				aria-label="Save"
				onClick={saveDetails}
			>
				<SaveIcon />
			</FixedFab>
			<FixedFab
				visible={!readOnly}
				col={3}
				color={dirty ? 'secondary' : 'default'}
				disabled={loading || saving}
				aria-label="Undo"
				onClick={() => {
					dispatch({type: 'undo'});
				}}
			>
				<UndoIcon />
			</FixedFab>
			<FixedFab
				visible={readOnly}
				disabled={loading || editing}
				pending={editing && readOnly}
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
				visible={readOnly}
				disabled={loading || editing}
				col={3}
				endpoint={patientsAttach}
				item={patient._id}
			>
				<AttachFileIcon />
			</AttachFileButton>
			<ManageConsultationsForPatientButton
				Button={FixedFab}
				visible={readOnly}
				disabled={loading || editing}
				col={4}
				color="primary"
				patientId={patient._id}
				tooltip="More actions!"
			/>
			<FixedFab
				visible={readOnly}
				disabled={loading || editing}
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
