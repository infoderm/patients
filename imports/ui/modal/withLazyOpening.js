import React, {useState, useEffect} from 'react';

const withLazyOpening = (Openable) => (props) => {
	const {open} = props;

	const [triedToOpen, setTriedToOpen] = useState(false);
	const render = open || triedToOpen;

	useEffect(() => {
		if (render && !triedToOpen) {
			setTriedToOpen(true);
		}
	}, [render, triedToOpen]);

	if (!triedToOpen) {
		return null;
	}

	return <Openable {...props} />;
};

export default withLazyOpening;
