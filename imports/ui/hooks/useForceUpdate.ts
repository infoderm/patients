import {useCallback, useState} from 'react';

const useForceUpdate = () => {
	// eslint-disable-next-line react/hook-use-state
	const [, updateState] = useState<object>();
	return useCallback(() => {
		updateState({});
	}, []);
};

export default useForceUpdate;
