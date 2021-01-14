import useAny from './useAny.js';

const useAll = (value) => !useAny(!value);

export default useAll;
