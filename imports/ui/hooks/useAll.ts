import useAny from './useAny';

const useAll = (value: any) => !useAny(!value);

export default useAll;
