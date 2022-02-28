import {DependencyList, useState, useEffect} from 'react';

const useStateWithInitOverride = (init: any, deps: DependencyList = [init]) => {
	const [value, setValue] = useState(init);
	useEffect(() => {
		setValue(init);
	}, deps);
	return [value, setValue];
};

export default useStateWithInitOverride;
