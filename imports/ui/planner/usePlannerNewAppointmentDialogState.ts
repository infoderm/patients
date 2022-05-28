import {useCallback, useState} from 'react';
import {useSettingCached} from '../settings/hooks';

const usePlannerNewAppointmentDialogState = () => {
	const [initialDatetime, setInitialDatetime] = useState(new Date());
	const [noInitialTime, setNoInitialTime] = useState(true);
	const [open, setOpen] = useState(false);
	const {value: agendaSlotClickSetsInitialTime} = useSettingCached(
		'agenda-slot-click-sets-initial-time',
	);
	const alwaysNoInitialTime = agendaSlotClickSetsInitialTime === 'off';

	const openOn = useCallback(
		(date: Date, noInitialTime = true) => {
			console.debug({date, noInitialTime});
			setInitialDatetime(date);
			setNoInitialTime(alwaysNoInitialTime || noInitialTime);
			setOpen(true);
		},
		[setInitialDatetime, setNoInitialTime, setOpen, alwaysNoInitialTime],
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
