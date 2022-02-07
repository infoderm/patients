import {useRef} from 'react';

const useAny = (value: any) => {
	const ref = useRef(false);
	ref.current = value || ref.current;
	return ref.current;
};

export default useAny;
