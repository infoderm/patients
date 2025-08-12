import {useCallback, useState} from 'react';

const usePlannerNewAppointmentDialogState = () => {
	const [initialBegin, setInitialBegin] = useState(new Date());
	const [initialEnd, setInitialEnd] = useState(initialBegin);
	const [open, setOpen] = useState(false);

	const openOn = useCallback(
		(begin: Date, end: Date) => {
			console.debug({begin, end});
			setInitialBegin(begin);
			setInitialEnd(end);
			setOpen(true);
		},
		[setInitialBegin, setInitialEnd, setOpen],
	);

	const onClose = useCallback(() => {
		setOpen(false);
	}, [setOpen]);

	return {
		open,
		onClose,
		initialBegin,
		initialEnd,
		openOn,
	};
};

export default usePlannerNewAppointmentDialogState;
