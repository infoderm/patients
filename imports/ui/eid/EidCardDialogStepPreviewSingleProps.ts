import {type useNavigate} from 'react-router-dom';

import { EidFields } from '../../api/collection/eids';

type Props = {
	titleId?: string;
	onPrevStep: () => void;
	patientId: string;
	eidInfo: EidFields;
	navigate: ReturnType<typeof useNavigate>;
	onClose: () => void;
};
export default Props;
