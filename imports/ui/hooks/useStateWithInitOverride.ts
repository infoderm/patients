import {
	type DependencyList,
	useState,
	useLayoutEffect,
	type Dispatch,
	type SetStateAction,
} from 'react';

const useStateWithInitOverride = <T>(
	init: T,
	deps: DependencyList = [init],
): [T, Dispatch<SetStateAction<T>>] => {
	const [value, setValue] = useState<T>(init);
	useLayoutEffect(() => {
		// NOTE We use useLayoutEffect here to avoid rendering transient states
		// where the initial value has changed but the effect has not kicked in
		// yet.
		setValue(init);
	}, deps);
	return [value, setValue];
};

export default useStateWithInitOverride;
