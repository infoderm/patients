import useLastTruthyValue from './useLastTruthyValue';

const useAll = (value: any): boolean => !useLastTruthyValue(!value);

export default useAll;
