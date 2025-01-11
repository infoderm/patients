import {type useNavigate} from 'react-router-dom';

import {type EidFields} from '../../api/collection/eids';

type Props = {
	titleId?: string;
	onPrevStep: () => void;
	patientId: string;
	eidInfo: EidFields;
	navigate: ReturnType<typeof useNavigate>;
	onConfirm: () => void;
};
export default Props;
