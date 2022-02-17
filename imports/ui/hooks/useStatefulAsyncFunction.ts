import {useCallback, useState} from 'react';

interface State {
	pending: boolean;
}

const useStatefulAsyncFunction = <Callback>(
	fn: Callback,
): [Callback, State] => {
	const [pending, setPending] = useState(false);

	const callback = useCallback(
		async (...args: any[]) => {
			setPending(true);
			// @ts-expect-error unable to be generic on argument types an arity
			return fn(...args).then(
				(result) => {
					setPending(false);
					return result;
				},
				(error) => {
					setPending(false);
					// eslint-disable-next-line @typescript-eslint/no-throw-literal
					throw error;
				},
			);
		},
		[fn, setPending],
	) as unknown as Callback;

	return [
		callback,
		{
			pending,
		},
	];
};

export default useStatefulAsyncFunction;
