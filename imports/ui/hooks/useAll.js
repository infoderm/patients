import useAny from './useAny';

const useAll = (value) => !useAny(!value);

export default useAll;
