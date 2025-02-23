import useReduce from './useReduce';

const lastTruthyValue = (acc: any, value: any) => value || acc;

const useLastTruthyValue = (value: any) =>
	useReduce(lastTruthyValue, value, undefined);

export default useLastTruthyValue;
