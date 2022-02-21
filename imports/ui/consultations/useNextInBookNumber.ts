import useLastConsultationOfThisYear from './useLastConsultationOfThisYear';

const useNextInBookNumber = (book: string) => {
	const {loading, consultation} = useLastConsultationOfThisYear({
		book,
	});

	const inBookNumber = (consultation?.inBookNumber ?? 0) + 1;

	return {loading, inBookNumber};
};

export default useNextInBookNumber;
