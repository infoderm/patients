import {useState, useEffect} from 'react';

const useAny = (value) => {
	const [any, setAny] = useState(false);
	const toggleOnce = value || any;

	useEffect(() => {
		if (toggleOnce && !any) {
			setAny(true);
		}
	}, [toggleOnce, any]);

	return any;
};

export default useAny;
