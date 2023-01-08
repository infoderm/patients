import {useRef, useEffect, type DependencyList} from 'react';

const usePreviousRenderValues = (
	values: DependencyList,
	init: DependencyList = [],
) => {
	const ref = useRef(init);

	useEffect(() => {
		ref.current = values;
	}, values);

	return ref.current;
};

export default usePreviousRenderValues;
