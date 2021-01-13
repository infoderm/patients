import {useState, useEffect} from 'react';

const useOpened = (open) => {
	// TODO generalize

	const [opened, setOpened] = useState(false);
	const render = open || opened;

	useEffect(() => {
		if (render && !opened) {
			setOpened(true);
		}
	}, [render, opened]);

	return opened;
};

export default useOpened;
