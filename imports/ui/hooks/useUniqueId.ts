import useUniqueIncreasingBigNumber from './useUniqueIncreasingBigNumber';

const useUniqueId = (prefix: string) => {
	const i = useUniqueIncreasingBigNumber();
	return `${prefix}-${i}`;
};

export default useUniqueId;
