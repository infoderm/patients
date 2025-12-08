import {
	type DependencyList,
	type EffectCallback,
	useEffect,
	useMemo,
} from 'react';

const TIMEOUT_DANGLING = 1000;

const useImmediateEffect = (effect: EffectCallback, deps: DependencyList) => {
	const [cleanup, timeout] = useMemo(() => {
		let _cleanup: (() => void) | void = effect();
		const cleanup = () => {
			if (_cleanup === undefined) return;
			_cleanup();
			_cleanup = undefined;
		};

		const timeout = setTimeout(cleanup, TIMEOUT_DANGLING);
		return [cleanup, timeout];
	}, deps);

	useEffect(() => {
		clearTimeout(timeout);
		return cleanup;
	}, [cleanup, timeout]);
};

export default useImmediateEffect;
