import {useRef, useEffect, useCallback} from 'react';

/**
 * See https://gist.github.com/jaydenseric/a67cfb1b809b1b789daa17dfe6f83daa
 * @deprecated see https://github.com/facebook/react/pull/22114
 */
const useIsMounted = () => {
	const componentIsMounted = useRef(false);

	useEffect(() => {
		// Component is mounted.
		componentIsMounted.current = true;
		return () => {
			// Component is unmounted.
			componentIsMounted.current = false;
		};
	}, []);

	return useCallback(() => componentIsMounted.current, [componentIsMounted]);
};

export default useIsMounted;
