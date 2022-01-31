import {History} from 'history';

import {PatientIdFields} from '../../api/collection/patients';

export default interface Props {
	onPrevStep: () => void;
	patientId: string;
	eidInfo: PatientIdFields;
	history: History;
	onClose: () => void;
}
