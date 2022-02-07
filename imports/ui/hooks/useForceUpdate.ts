import {useCallback, useState} from 'react';

const useForceUpdate = () => {
	const [, updateState] = useState<object>();
	return useCallback(() => {
		updateState({});
	}, []);
};

export default useForceUpdate;
