import {useRef, useEffect} from 'react';

const useHasMounted = () => {
	const componentHasMounted = useRef(false);

	useEffect(() => {
		componentHasMounted.current = true;
	}, []);

	return () => componentHasMounted.current;
};

export default useHasMounted;
