import {useMemo} from 'react';

let i = 0n;

const increment = () => ++i;

const useUniqueIncreasingBigNumber = () => useMemo(increment, []);

export default useUniqueIncreasingBigNumber;
