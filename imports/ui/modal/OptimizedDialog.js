import React, {useState, useEffect} from 'react';

import Dialog from '@material-ui/core/Dialog';

export default function ConsultationDeletionDialog (props) {

	const { open , children } = props ;

	const [triedToOpen, setTriedToOpen] = useState(false);

	useEffect(
		() => {
			if (open && !triedToOpen) setTriedToOpen(true);
		} ,
		[open || triedToOpen]
	) ;

	if (!triedToOpen) return null;

	return <Dialog {...props}>{children}</Dialog> ;

}
