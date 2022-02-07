import {useNavigate} from 'react-router-dom';

import {PatientIdFields} from '../../api/collection/patients';

export default interface Props {
	onPrevStep: () => void;
	patientId: string;
	eidInfo: PatientIdFields;
	navigate: ReturnType<typeof useNavigate>;
	onClose: () => void;
}
