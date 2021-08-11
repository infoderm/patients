import {useState} from 'react';

const useRandom = (): [number, () => void] => {
	const [value, setValue] = useState(Math.random());
	return [
		value,
		() => {
			setValue(Math.random());
		},
	];
};

export default useRandom;
