import {
	type DependencyList,
	useState,
	useEffect,
	type Dispatch,
	type SetStateAction,
} from 'react';

const useStateWithInitOverride = <T>(
	init: T,
	deps: DependencyList = [init],
): [T, Dispatch<SetStateAction<T>>] => {
	const [value, setValue] = useState<T>(init);
	useEffect(() => {
		setValue(init);
	}, deps);
	return [value, setValue];
};

export default useStateWithInitOverride;
