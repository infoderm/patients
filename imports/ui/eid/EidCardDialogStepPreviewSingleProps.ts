import {type useNavigate} from 'react-router-dom';

import {type PatientIdFields} from '../../api/collection/patients';

type Props = {
	titleId?: string;
	onPrevStep: () => void;
	patientId: string;
	eidInfo: PatientIdFields;
	navigate: ReturnType<typeof useNavigate>;
	onClose: () => void;
};
export default Props;
