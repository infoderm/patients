import useUniqueIncreasingBigNumber from './useUniqueIncreasingBigNumber';

/**
 * @deprecated mui v5 handles this for all inputs and that's the only place we
 * need this
 */
const useUniqueId = (prefix: string) => {
	const i = useUniqueIncreasingBigNumber();
	return `${prefix}-${i}`;
};

export default useUniqueId;
