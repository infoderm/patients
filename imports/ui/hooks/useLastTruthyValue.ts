import {useRef} from 'react';

const useLastTruthyValue = (value: any) => {
	const ref = useRef<any>(undefined);
	ref.current = value || ref.current;
	return ref.current;
};

export default useLastTruthyValue;
