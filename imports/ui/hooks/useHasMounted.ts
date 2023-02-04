import {useRef, useEffect} from 'react';

const useHasMounted = () => {
	const componentWasMounted = useRef(false);

	useEffect(() => {
		componentWasMounted.current = true;
	}, []);

	return () => componentWasMounted.current;
};

export default useHasMounted;
