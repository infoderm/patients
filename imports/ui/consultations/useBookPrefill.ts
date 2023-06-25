import {filterBookPrefill} from '../../api/consultations';

import useLastConsultationOfThisYear from './useLastConsultationOfThisYear';

const useBookPrefill = () => {
	const {loading, consultation} = useLastConsultationOfThisYear(
		filterBookPrefill(),
	);

	const bookNumber = consultation ? consultation.book : '1';
	const inBookNumber = (consultation?.inBookNumber ?? 0) + 1;

	return {loading, bookNumber, inBookNumber};
};

export default useBookPrefill;
