import useLastTruthyValue from './useLastTruthyValue';

const useAny = (value: any): boolean => Boolean(useLastTruthyValue(value));

export default useAny;
