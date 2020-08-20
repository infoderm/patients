import React, {useState, useEffect} from 'react';

import Dialog from '@material-ui/core/Dialog';

export default function OptimizedDialog(props) {
	const {open, children} = props;

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

	return <Dialog {...props}>{children}</Dialog>;
}
