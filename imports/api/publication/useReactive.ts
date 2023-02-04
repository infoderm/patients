import {type DependencyList, useCallback} from 'react';
import {useTracker} from 'meteor/react-meteor-data';

import useHasMounted from '../../ui/hooks/useHasMounted';

const useReactive = <R>(reactiveFn: () => R, deps?: DependencyList) => {
	const hasMounted = useHasMounted();
	const skipUpdate = useCallback(() => !hasMounted(), [hasMounted]);
	// @ts-expect-error Types are wrong.
	return useTracker(reactiveFn, deps, skipUpdate);
};

export default useReactive;
