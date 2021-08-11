import {useRef, useEffect} from 'react';

// See https://gist.github.com/jaydenseric/a67cfb1b809b1b789daa17dfe6f83daa
const useIsMounted = () => {
	// Component is certainly mounted from the beginning
	const componentIsMounted = useRef(true);

	useEffect(
		() =>
			// When non-SSR + (ComponentDidMount or ComponentDidUpdate):
			// do nothing.
			// when non-SSR + ComponentWillUnmount:
			() => {
				componentIsMounted.current = false;
			},
		[],
	);

	return () => componentIsMounted.current;
};

export default useIsMounted;
