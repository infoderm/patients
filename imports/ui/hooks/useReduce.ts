import {useRef} from 'react';

const useReduce = <A, T>(
	reduce: (acc: A, value: T) => A,
	value: T,
	init: A,
) => {
	const ref = useRef<A>(init);
	ref.current = reduce(ref.current, value);
	return ref.current;
};

export default useReduce;
