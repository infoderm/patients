import {useCallback, useState} from 'react';

const usePlannerNewAppointmentDialogState = () => {
	const [initialDatetime, setInitialDatetime] = useState(new Date());
	const [noInitialTime, setNoInitialtime] = useState(true);
	const [open, setOpen] = useState(false);

	const openOn = useCallback(
		(date: Date, noInitialTime = true) => {
			console.debug({date, noInitialTime});
			setInitialDatetime(date);
			setNoInitialtime(noInitialTime);
			setOpen(true);
		},
		[setInitialDatetime, setNoInitialtime, setOpen],
	);

	const onClose = useCallback(() => {
		setOpen(false);
	}, [setOpen]);

	return {
		open,
		onClose,
		initialDatetime,
		noInitialTime,
		openOn,
	};
};

export default usePlannerNewAppointmentDialogState;
