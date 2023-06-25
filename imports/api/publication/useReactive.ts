import {type DependencyList} from 'react';

import useTracker from './useTracker';

const useReactive = <R>(reactiveFn: () => R, deps?: DependencyList) => {
	return useTracker(reactiveFn, deps);
};

export default useReactive;
