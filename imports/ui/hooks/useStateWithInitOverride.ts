import {DependencyList, useState, useEffect} from 'react';

const useStateWithInitOverride = (init: any, deps: DependencyList = [init]) => {
	const [value, setValue] = useState(init);
	useEffect(() => {
		if (init !== value) setValue(init);
	}, deps);
	return [value, setValue];
};

export default useStateWithInitOverride;
