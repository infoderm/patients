import {useState, useCallback} from 'react';

const useRandom = (): [number, () => void] => {
	const [value, setValue] = useState(Math.random());

	const update = useCallback(() => {
		setValue(Math.random());
	}, [setValue]);

	return [value, update];
};

export default useRandom;
